'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { PLANETS_DATA } from '@/lib/planets-data';

export interface Category {
  id: number;
  name: string;
  planet: string;
  icon: string;
  element?: string;
  description: string;
  gradient: string;
}

interface CategoryGridProps {
  categories: Category[];
  columns?: 3 | 4 | 6;
}

export function CategoryGrid({ categories, columns = 4 }: CategoryGridProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const gridCols = {
    3: 'grid-cols-3',
    4: 'grid-cols-3 sm:grid-cols-4',
    6: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6',
  };

  return (
    <div
      ref={ref as any}
      className={`grid ${gridCols[columns]} gap-4 sm:gap-5`}
    >
      {categories.map((cat, index) => {
        const planetData = PLANETS_DATA.find(p => p.name === cat.planet);
        const bgColor = planetData?.color || '#7B68EE';
        const isHovered = hoveredId === cat.id;

        return (
          <CategoryItem
            key={cat.id}
            category={cat}
            index={index}
            isVisible={isVisible}
            isHovered={isHovered}
            bgColor={bgColor}
            onHover={() => setHoveredId(cat.id)}
            onLeave={() => setHoveredId(null)}
          />
        );
      })}
    </div>
  );
}

interface CategoryItemProps {
  category: Category;
  index: number;
  isVisible: boolean;
  isHovered: boolean;
  bgColor: string;
  onHover: () => void;
  onLeave: () => void;
}

function CategoryItem({
  category,
  index,
  isVisible,
  isHovered,
  bgColor,
  onHover,
  onLeave,
}: CategoryItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  // 3D hover effect with mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return;

    const rect = itemRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransform(`perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform('');
    onLeave();
  }, [onLeave]);

  // Calculate stagger delay
  const staggerDelay = index * 50;

  return (
    <Link href={`/category/${category.id}`}>
      <div
        ref={itemRef}
        className="group flex flex-col items-center gap-3 cursor-pointer transition-all duration-500"
        style={{
          transform: isHovered ? transform : undefined,
          animation: isVisible
            ? `slideUp 0.5s ease-out ${staggerDelay}ms both, fadeIn 0.5s ease-out ${staggerDelay}ms both`
            : undefined,
          opacity: isVisible ? undefined : 0,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={onHover}
        onMouseLeave={handleMouseLeave}
      >
        {/* Premium Planet Card */}
        <div className="relative">
          {/* Glow ring - animated on hover */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-500 blur-xl ${isHovered ? 'opacity-100 scale-150' : 'opacity-0 scale-100'}`}
            style={{
              background: `radial-gradient(circle, ${bgColor}88, transparent)`,
            }}
          />

          {/* Planet circle with orbit animation */}
          <div
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-lg transition-all duration-500 overflow-hidden"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${bgColor}dd, ${bgColor}88)`,
              boxShadow: isHovered
                ? `0 8px 40px ${bgColor}66, inset 0 0 30px ${bgColor}44`
                : `0 4px 20px ${bgColor}44, inset 0 0 20px ${bgColor}22`,
            }}
          >
            {/* Shimmer sweep effect on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`}
              style={{ transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)' }}
            />

            {/* Icon with bounce animation */}
            <span
              className={`relative z-10 transition-all duration-500 ${isHovered ? 'animate-icon-bounce' : ''}`}
              style={{
                transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                filter: isHovered ? 'drop-shadow(0 0 10px white)' : 'none',
              }}
            >
              {category.icon}
            </span>

            {/* Orbital ring - appears on hover */}
            <div
              className={`absolute inset-[-4px] border-2 border-dashed rounded-full transition-all duration-700 ${isHovered ? 'opacity-60 animate-spin-slow' : 'opacity-0'}`}
              style={{ borderColor: `${bgColor}88` }}
            />

            {/* Second orbital ring */}
            <div
              className={`absolute inset-[-8px] border rounded-full transition-all duration-700 ${isHovered ? 'opacity-40 animate-spin-reverse-slow' : 'opacity-0'}`}
              style={{ borderColor: `${bgColor}66` }}
            />
          </div>

          {/* Element badge with pulse */}
          {category.element && (
            <div
              className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md transition-all duration-300 ${isHovered ? 'scale-125 animate-pulse' : 'scale-100'}`}
              style={{ background: bgColor }}
            >
              {category.element}
            </div>
          )}
        </div>

        {/* Category info with text animation */}
        <div className="text-center space-y-1">
          <div
            className={`text-sm sm:text-base font-bold transition-all duration-300 ${isHovered ? 'text-transparent bg-gradient-to-r from-star-gold via-cosmic-purple to-nebula-pink bg-clip-text' : 'text-gray-900'}`}
          >
            {category.name}
          </div>
          <div
            className={`text-[10px] sm:text-xs transition-all duration-300 ${isHovered ? 'text-gray-700' : 'text-gray-500'}`}
          >
            {category.description}
          </div>

          {/* Planet name on hover */}
          <div
            className={`text-[9px] font-medium text-cosmic-purple transition-all duration-300 overflow-hidden ${isHovered ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            {category.planet}
          </div>
        </div>
      </div>
    </Link>
  );
}

// CSS animations - add to globals.css or include here
const styles = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes spin-reverse-slow {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }

  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }

  .animate-spin-reverse-slow {
    animation: spin-reverse-slow 12s linear infinite;
  }
`;
