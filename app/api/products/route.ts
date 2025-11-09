import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FEATURED_PRODUCTS } from '@/lib/products-data';

/**
 * GET /api/products
 *
 * Returns all active products from PostgreSQL via Prisma
 * Fallback: Uses hardcoded data if database is unavailable
 */
export async function GET() {
  try {
    // Fetch from PostgreSQL database
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    // If database has no data, use hardcoded fallback
    if (products.length === 0) {
      console.warn('No products in database, using hardcoded fallback');
      const fallbackProducts = FEATURED_PRODUCTS.map((product) => ({
        id: String(product.id),
        name: product.title,
        description: product.subtitle,
        price: calculatePrice(product.discount),
        category: getCategoryName(product.categoryIds[0]),
        imageUrl: product.image,
        isActive: true,
        rating: product.rating,
        views: product.views,
        discount: product.discount,
        categoryIds: product.categoryIds,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      return NextResponse.json(fallbackProducts, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching products from database:', error);

    // Fallback to hardcoded data on database error
    const fallbackProducts = FEATURED_PRODUCTS.map((product) => ({
      id: String(product.id),
      name: product.title,
      description: product.subtitle,
      price: calculatePrice(product.discount),
      category: getCategoryName(product.categoryIds[0]),
      imageUrl: product.image,
      isActive: true,
      rating: product.rating,
      views: product.views,
      discount: product.discount,
      categoryIds: product.categoryIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return NextResponse.json(fallbackProducts, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  }
}

function calculatePrice(discount: number): number {
  // Base price calculation (예: 할인율 기반)
  const basePrice = 10000;
  return Math.round(basePrice * (1 - discount / 100));
}

function getCategoryName(categoryId: number): string {
  const categories: Record<number, string> = {
    1: '이벤트',
    2: '궁합',
    3: '솔로/연애운',
    4: '이별/재회',
    5: '직장/직업운',
    6: '재물/금전운',
    7: '결혼운',
    8: '월별운세',
  };
  return categories[categoryId] || '기타';
}
