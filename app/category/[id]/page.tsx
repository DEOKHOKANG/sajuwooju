import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { IMAGE_MAP } from '@/lib/image-map';
import { FEATURED_PRODUCTS } from '@/lib/products-data';
import { ProductCard } from '@/components/product-card';
import Image from 'next/image';

export async function generateStaticParams() {
  return IMAGE_MAP.categories.map((category) => ({
    id: category.id.toString(),
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = IMAGE_MAP.categories.find(c => c.id === parseInt(id));

  if (!category) {
    notFound();
  }

  // Filter products by category ID
  const categoryProducts = FEATURED_PRODUCTS.filter(product =>
    product.categoryIds.includes(parseInt(id))
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="mx-auto w-full max-w-[600px] px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <button
              className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
              style={{ borderRadius: '50%' }}
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
          </Link>
          <h1 className="font-display text-lg font-semibold text-primary">
            {category.label}
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[600px] px-4 pb-20">
        {/* Category Header */}
        <section className="py-6">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-20 h-20 bg-muted flex items-center justify-center overflow-hidden relative"
              style={{ borderRadius: '50%' }}
            >
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.label}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  sizes="80px"
                />
              ) : (
                <span className="text-4xl">{category.icon}</span>
              )}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-primary mb-1">
                {category.label}
              </h2>
              <p className="text-sm text-slate-500">
                {categoryProducts.length}개의 상품
              </p>
            </div>
          </div>

          <div className="bg-muted-100 p-4 mb-6" style={{ borderRadius: '12px' }}>
            <p className="text-sm text-primary leading-relaxed">
              {category.label} 관련 전문 사주 상담을 받아보세요.
              정확한 사주 분석을 통해 당신의 운세를 알려드립니다.
            </p>
          </div>
        </section>

        {/* Products List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-primary">
              추천 상품
            </h3>
            <span className="text-xs text-slate-400">
              {categoryProducts.length}개
            </span>
          </div>

          <div className="space-y-3">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
