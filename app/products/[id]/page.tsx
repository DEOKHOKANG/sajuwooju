import { notFound } from 'next/navigation';
import { FEATURED_PRODUCTS } from '@/lib/products-data';
import { ProductDetailClient } from '@/components/products/ProductDetailClient';

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

  return <ProductDetailClient product={product} />;
}
