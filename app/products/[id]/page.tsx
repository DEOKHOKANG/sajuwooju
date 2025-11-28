import { notFound } from 'next/navigation';
import { FEATURED_PRODUCTS } from '@/lib/products-data';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Eye, ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  return FEATURED_PRODUCTS.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = FEATURED_PRODUCTS.find(p => p.id === parseInt(id));

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button */}
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
          <h1 className="font-display text-lg font-semibold text-primary truncate flex-1">
            {product.title}
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[600px] px-4 pb-32">
        {/* Product Image */}
        <section className="py-6">
          <div
            className="relative w-full aspect-square bg-gradient-to-br from-pink-100 to-pink-200 overflow-hidden"
            style={{ borderRadius: '20px' }}
          >
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 600px"
              priority
            />
          </div>
        </section>

        {/* Product Info */}
        <section className="py-4 border-b border-border">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-primary mb-2">
                {product.title}
              </h2>
              <p className="text-lg text-primary mb-3">
                {product.subtitle}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-5 h-5 fill-yellow-500" />
              <span className="font-bold text-primary">{product.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Eye className="w-5 h-5" />
              <span className="text-sm">{product.views}</span>
            </div>
            <div
              className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium ml-auto"
              style={{ borderRadius: '9999px' }}
            >
              {product.discount}% 할인중
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-secondary">
              {Math.round(10000 * (100 - product.discount) / 100).toLocaleString()}원
            </span>
            <span className="text-lg text-slate-400 line-through">
              10,000원
            </span>
          </div>
        </section>

        {/* Description */}
        <section className="py-6 border-b border-border">
          <h3 className="font-display text-xl font-bold text-primary mb-4">
            상품 설명
          </h3>
          <div className="space-y-3 text-primary leading-relaxed">
            <p>
              {product.subtitle}에 대한 상세한 사주 상담을 받아보세요.
            </p>
            <p>
              전문 사주 상담사가 정확한 사주 분석을 통해 고객님의 운세와 미래를 알려드립니다.
            </p>
            <div className="bg-muted-100 p-4 mt-4" style={{ borderRadius: '12px' }}>
              <h4 className="font-bold mb-2">포함 내용</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-secondary">✓</span>
                  <span>개인 맞춤 사주 분석</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">✓</span>
                  <span>상세한 운세 해설</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">✓</span>
                  <span>PDF 결과 제공</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">✓</span>
                  <span>1:1 채팅 상담 (30분)</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-6">
          <h3 className="font-display text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <span>고객 후기</span>
            <span className="text-sm text-slate-400 font-normal">
              ({Math.floor(product.rating * 100)} 개)
            </span>
          </h3>

          <div className="space-y-3">
            {/* Review 1 */}
            <div className="bg-muted-100 p-4" style={{ borderRadius: '12px' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center text-sm" style={{ borderRadius: '50%' }}>
                    👤
                  </div>
                  <span className="font-bold text-sm text-primary">김**</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-primary leading-relaxed">
                정말 정확한 분석이었어요! {product.title}를 받아보니 제 상황을 딱 집어주셔서 놀랐습니다. 추천합니다!
              </p>
              <span className="text-xs text-slate-400 mt-2 block">2024년 10월</span>
            </div>

            {/* Review 2 */}
            <div className="bg-muted-100 p-4" style={{ borderRadius: '12px' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center text-sm" style={{ borderRadius: '50%' }}>
                    👤
                  </div>
                  <span className="font-bold text-sm text-primary">이**</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-primary leading-relaxed">
                상세한 설명 감사합니다. 채팅 상담도 친절하게 답변해주셔서 많은 도움이 되었어요.
              </p>
              <span className="text-xs text-slate-400 mt-2 block">2024년 10월</span>
            </div>

            {/* Review 3 */}
            <div className="bg-muted-100 p-4" style={{ borderRadius: '12px' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center text-sm" style={{ borderRadius: '50%' }}>
                    👤
                  </div>
                  <span className="font-bold text-sm text-primary">박**</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                  <Star className="w-4 h-4 text-slate-300" />
                </div>
              </div>
              <p className="text-sm text-primary leading-relaxed">
                기대 이상이었습니다. PDF 자료도 깔끔하게 잘 정리되어 있어요. 가격 대비 만족스러워요!
              </p>
              <span className="text-xs text-slate-400 mt-2 block">2024년 9월</span>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40">
        <div className="mx-auto w-full max-w-[600px] p-4">
          <button
            className="w-full bg-secondary text-white font-bold py-4 text-lg hover:bg-secondary/90 transition-colors"
            style={{ borderRadius: '12px' }}
          >
            상담 신청하기
          </button>
        </div>
      </div>
    </div>
  );
}
