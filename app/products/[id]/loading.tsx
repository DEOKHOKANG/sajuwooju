import { Skeleton } from '@/components/ui/skeleton';

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-full max-w-[600px] px-4 sm:px-6 lg:px-8 pb-20">
        {/* Image Skeleton */}
        <section className="py-6">
          <Skeleton className="w-full h-64 sm:h-80 rounded-2xl" />
        </section>

        {/* Title Skeleton */}
        <section className="py-4">
          <Skeleton className="h-8 w-3/4 mb-3" />
          <Skeleton className="h-6 w-1/2 mb-4" />
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </section>

        {/* Description Skeleton */}
        <section className="py-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </section>

        {/* CTA Button Skeleton */}
        <section className="py-6">
          <Skeleton className="h-12 w-full rounded-xl" />
        </section>
      </main>
    </div>
  );
}
