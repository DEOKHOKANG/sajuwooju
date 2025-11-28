'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Eye } from 'lucide-react';

export interface Product {
  id: number;
  title: string;
  subtitle: string;
  rating: number;
  views: string;
  discount: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  index?: number; // For stagger animation
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt effect with mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8; // Max 8 degrees
    const rotateY = ((x - centerX) / centerX) * 8;  // Max 8 degrees

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  };

  // Calculate stagger delay for entrance animation
  const staggerDelay = index * 100;

  return (
    <Link href={`/products/${product.id}`}>
      <div
        ref={cardRef}
        className="bg-muted-100 overflow-hidden cursor-pointer transition-all duration-300 ease-out"
        style={{
          borderRadius: '16px',
          willChange: 'transform, box-shadow',
          boxShadow: isHovered
            ? '0 20px 40px rgba(123, 104, 238, 0.2), 0 10px 20px rgba(0, 0, 0, 0.1)'
            : '0 1px 3px rgba(0, 0, 0, 0.1)',
          transform,
          transformStyle: 'preserve-3d',
          animation: `slideUp 0.5s ease-out ${staggerDelay}ms both`,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
          {/* Product Image with shimmer effect */}
          <div
            className={`w-16 h-20 sm:w-20 sm:h-24 bg-gradient-to-br from-pink-100 to-pink-200 flex-shrink-0 relative overflow-hidden transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
            style={{
              borderRadius: '12px',
              transformStyle: 'preserve-3d',
              transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)',
            }}
          >
            <Image
              src={product.image}
              alt={product.title}
              width={80}
              height={96}
              className="object-cover w-full h-full"
              sizes="(max-width: 640px) 64px, 80px"
            />
            {/* Shimmer overlay on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-opacity duration-300 ${isHovered ? 'animate-shimmer opacity-100' : 'opacity-0'}`}
              style={{
                backgroundSize: '200% 100%',
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0" style={{ transform: isHovered ? 'translateZ(10px)' : 'translateZ(0)', transition: 'transform 0.3s ease-out' }}>
            <div
              className={`font-bold text-primary mb-1 text-sm sm:text-base truncate transition-colors duration-300 ${isHovered ? 'text-secondary' : ''}`}
            >
              {product.title}
            </div>
            <div className="text-xs sm:text-sm text-primary mb-2 truncate">
              {product.subtitle}
            </div>

            {/* Stats with animated stars */}
            <div className="flex gap-2 text-xs sm:text-sm mb-2">
              <span className="text-yellow-500 flex items-center gap-0.5">
                <Star
                  className={`w-3 h-3 sm:w-4 sm:h-4 fill-yellow-500 transition-transform duration-300 ${isHovered ? 'animate-pulse scale-110' : ''}`}
                />
                <span className={`transition-all duration-300 ${isHovered ? 'font-bold' : ''}`}>
                  {product.rating}
                </span>
              </span>
              <span className="text-slate-400 flex items-center gap-0.5">
                <Eye className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
                {product.views}
              </span>
            </div>

            {/* Discount Badge with pulse animation */}
            <div
              className={`inline-block px-2 sm:px-3 py-1 bg-secondary/10 text-secondary text-[10px] sm:text-xs font-medium transition-all duration-300 ${isHovered ? 'animate-discount-pulse bg-secondary text-white shadow-lg shadow-secondary/30' : ''}`}
              style={{
                borderRadius: '9999px',
                transform: isHovered ? 'translateZ(15px) scale(1.05)' : 'translateZ(0)',
              }}
            >
              {product.discount}% 할인중
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
