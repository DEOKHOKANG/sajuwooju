import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-full max-w-[600px] px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header Skeleton */}
        <section className="py-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-6 w-48" />
        </section>

        {/* Products Grid Skeleton */}
        <section className="py-4 space-y-3 sm:space-y-4">
          {[...Array(6)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </section>
      </main>
    </div>
  );
}
