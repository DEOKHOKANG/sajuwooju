'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Eye } from 'lucide-react';
import { PLANETS_DATA } from '@/lib/planets-data';

export interface Product {
  id: number;
  title: string;
  subtitle: string;
  rating: number;
  views: string;
  discount: number;
  image: string;
  element?: string; // 音양五行 (木火土金水)
}

interface ProductCardWoojuProps {
  product: Product;
}

// Map elements to planets
const getElementPlanet = (element?: string) => {
  if (!element) return PLANETS_DATA[0]; // Default to Mercury

  const elementMap: Record<string, string> = {
    '水': '수성', // Water
    '金': '금성', // Metal
    '土': '지구', // Earth
    '火': '화성', // Fire
    '木': '목성', // Wood
  };

  const planetName = elementMap[element];
  return PLANETS_DATA.find(p => p.name === planetName) || PLANETS_DATA[0];
};

export function ProductCardWooju({ product }: ProductCardWoojuProps) {
  const planet = getElementPlanet(product.element);

  return (
    <Link href={`/products/${product.id}`}>
      <div
        className="group relative overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1"
        style={{
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(45, 53, 97, 0.6) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(123, 104, 238, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          willChange: 'transform, box-shadow',
        }}
      >
        {/* Nebula Background Effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${planet.color}22, transparent 70%)`,
            filter: 'blur(20px)'
          }}
        />

        {/* Glow Border on Hover */}
        <div
          className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `0 0 20px ${planet.color}66, inset 0 0 20px ${planet.color}22`,
          }}
        />

        <div className="relative flex gap-3 sm:gap-4 p-4 sm:p-5">
          {/* Product Image with Planet Glow */}
          <div
            className="w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300"
            style={{
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${planet.color}33, ${planet.color}11)`,
              boxShadow: `0 0 15px ${planet.color}44`
            }}
          >
            <Image
              src={product.image}
              alt={product.title}
              width={96}
              height={112}
              className="object-cover w-full h-full"
              sizes="(max-width: 640px) 80px, 96px"
            />

            {/* Planet Icon Overlay */}
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full opacity-80"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${planet.color}88)`,
                boxShadow: `0 0 10px ${planet.color}`
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="font-bold text-white mb-1 text-sm sm:text-base line-clamp-2 leading-snug">
                {product.title}
              </div>
              <div className="text-xs sm:text-sm text-slate-300 mb-2 line-clamp-1">
                {product.subtitle}
              </div>

              {/* Element Badge */}
              {product.element && (
                <div
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${planet.color}44, ${planet.color}22)`,
                    border: `1px solid ${planet.color}66`,
                    color: planet.color
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: planet.color }} />
                  {product.element} • {planet.element}
                </div>
              )}
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-2 text-xs sm:text-sm">
                <span className="text-star-gold flex items-center gap-1">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-star-gold" />
                  <span className="font-medium">{product.rating}</span>
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{product.views}</span>
                </span>
              </div>

              {/* Discount Badge */}
              <div
                className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold rounded-full shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#0A0E27',
                }}
              >
                {product.discount}% OFF
              </div>
            </div>
          </div>
        </div>

        {/* Orbiting Stars Effect (subtle) */}
        <div className="absolute top-2 left-2 w-1 h-1 bg-star-gold rounded-full animate-twinkle opacity-0 group-hover:opacity-100" />
        <div className="absolute bottom-3 right-3 w-0.5 h-0.5 bg-white rounded-full animate-twinkle opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.5s' }} />
      </div>
    </Link>
  );
}
