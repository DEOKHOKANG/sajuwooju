/**
 * API Client for sajuwooju-enterprise-simplified
 * 어드민 서버와 통신하기 위한 API 클라이언트
 *
 * 환경변수:
 * NEXT_PUBLIC_API_URL=https://sajuwooju-enterprise.vercel.app
 */

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sajuwooju-enterprise.vercel.app';

// Types
export interface Product {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  shortDescription?: string;
  fullDescription?: string;
  features?: string[];
  price: number | null;
  discountPrice: number | null;
  discount: number;
  rating: number;
  reviewCount: number;
  views: number;
  purchaseCount: number;
  imageUrl: string;
  thumbnailUrl?: string;
  images?: string[];
  isActive: boolean;
  isFeatured: boolean;
  isPremium: boolean;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  gradient?: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Fetch wrapper with error handling
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP Error: ${response.status}`,
      };
    }

    return {
      success: true,
      data,
      pagination: data.pagination,
    };
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ================================
// Products API
// ================================

export interface GetProductsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  featured?: boolean;
  search?: string;
}

/**
 * 제품 목록 조회
 */
export async function getProducts(params: GetProductsParams = {}): Promise<{
  products: Product[];
  pagination?: ApiResponse<any>['pagination'];
  error?: string;
}> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.categoryId) searchParams.set('categoryId', params.categoryId);
  if (params.featured !== undefined) searchParams.set('featured', params.featured.toString());
  if (params.search) searchParams.set('search', params.search);

  const endpoint = `/api/products${searchParams.toString() ? `?${searchParams}` : ''}`;

  const response = await apiFetch<{ products: Product[] }>(endpoint, {
    next: { revalidate: 60 }, // ISR: 60초마다 재검증
  });

  if (!response.success) {
    return { products: [], error: response.error };
  }

  return {
    products: response.data?.products || [],
    pagination: response.pagination,
  };
}

/**
 * 추천 제품 목록 조회
 */
export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  const { products } = await getProducts({ featured: true, limit });
  return products;
}

/**
 * 제품 상세 조회
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await apiFetch<{ product: Product }>(`/api/products/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!response.success || !response.data?.product) {
    return null;
  }

  return response.data.product;
}

/**
 * 제품 상세 조회 (ID)
 */
export async function getProductById(id: string): Promise<Product | null> {
  const response = await apiFetch<{ product: Product }>(`/api/products/id/${id}`, {
    next: { revalidate: 60 },
  });

  if (!response.success || !response.data?.product) {
    return null;
  }

  return response.data.product;
}

// ================================
// Categories API
// ================================

/**
 * 카테고리 목록 조회
 */
export async function getCategories(): Promise<Category[]> {
  const response = await apiFetch<{ categories: Category[] }>('/api/categories', {
    next: { revalidate: 300 }, // 5분 캐시
  });

  if (!response.success || !response.data?.categories) {
    return [];
  }

  return response.data.categories;
}

/**
 * 카테고리 상세 조회
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const response = await apiFetch<{ category: Category }>(`/api/categories/${slug}`, {
    next: { revalidate: 300 },
  });

  if (!response.success || !response.data?.category) {
    return null;
  }

  return response.data.category;
}

/**
 * 카테고리별 제품 조회
 */
export async function getProductsByCategory(
  categoryId: string,
  params: Omit<GetProductsParams, 'categoryId'> = {}
): Promise<{
  products: Product[];
  pagination?: ApiResponse<any>['pagination'];
}> {
  return getProducts({ ...params, categoryId });
}

// ================================
// Utility Functions
// ================================

/**
 * Transform API product to local format
 * API 응답을 로컬 포맷으로 변환
 */
export function transformProduct(product: Product) {
  return {
    id: parseInt(product.id) || 0,
    title: product.title,
    subtitle: product.subtitle || product.shortDescription || '',
    image: product.imageUrl,
    rating: product.rating,
    reviews: product.reviewCount,
    views: product.views,
    discount: calculateDiscount(product.price, product.discountPrice),
    price: product.price,
    discountPrice: product.discountPrice,
    categoryIds: product.categories.map((c) => parseInt(c.id) || 0),
    isFeatured: product.isFeatured,
    isPremium: product.isPremium,
  };
}

/**
 * Calculate discount percentage
 */
function calculateDiscount(price: number | null, discountPrice: number | null): number {
  if (!price || !discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

/**
 * Format price with currency
 */
export function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return '가격 문의';
  return `${price.toLocaleString('ko-KR')}원`;
}

/**
 * Format views count
 */
export function formatViews(views: number): string {
  if (views >= 10000) {
    return `${Math.floor(views / 10000)}만+`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}천+`;
  }
  return views.toString();
}
