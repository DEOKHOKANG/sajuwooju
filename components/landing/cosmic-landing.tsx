'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// 3D Components (SSR disabled) - Import everything dynamically
const SpaceCanvas = dynamic(
  () => import('@/components/3d/SpaceCanvas').then((mod) => mod.SpaceCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-white text-sm">우주를 불러오는 중...</div>
      </div>
    )
  }
);

// Dynamically import the RotatingSystem to avoid SSR issues
const RotatingSystemComponent = dynamic(
  () => import('./RotatingSystemComponent').then((mod) => mod.RotatingSystemComponent),
  { ssr: false }
);

/**
 * Cosmic Landing Page Component
 * Full-screen black cosmic background with interactive solar system
 * 우주 배경의 랜딩 페이지 with 인터랙티브 태양계
 *
 * Features:
 * - Full-screen black cosmic background
 * - Interactive solar system with hover effects
 * - Fast rotation animation on click
 * - Redirect to main content page after animation
 */

export function CosmicLanding() {
  const router = useRouter();
  const [isRotating, setIsRotating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showBigBang, setShowBigBang] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true); // Enable clicking immediately

  const handleClick = () => {
    if (isRotating || !isLoaded) return; // Prevent multiple clicks
    setIsRotating(true);
  };

  const handleAnimationComplete = () => {
    // Trigger Big Bang flash effect
    setShowBigBang(true);

    // Redirect after flash animation (0.8s)
    setTimeout(() => {
      router.push('/main');
    }, 800);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Cosmic Black Background with subtle gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(15, 15, 35, 1) 0%, rgba(0, 0, 0, 1) 100%)',
        }}
      />

      {/* 3D Solar System Canvas */}
      <div
        className={`absolute inset-0 z-10 transition-all duration-300 ${
          isLoaded ? 'cursor-pointer' : 'cursor-wait'
        } ${isHovering && !isRotating && isLoaded ? 'scale-105' : 'scale-100'}`}
        onClick={handleClick}
        onMouseEnter={() => isLoaded && setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <SpaceCanvas
          enableControls={false}
          showStars={true}
          showMilkyWay={true}
          showNebula={false}
          enableBloom={true}
        >
          <RotatingSystemComponent
            isRotating={isRotating}
            onAnimationComplete={handleAnimationComplete}
          />
        </SpaceCanvas>
      </div>

      {/* Welcome Text Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        {/* Initial welcome text - hidden when rotating */}
        <div
          className={`text-center space-y-6 transition-opacity duration-1000 ${
            isRotating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight">
            <span className="bg-gradient-to-r from-star-gold via-cosmic-purple to-nebula-pink bg-clip-text text-transparent animate-glow-pulse">
              사주우주
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto px-4">
            우주의 법칙으로 읽는 나의 운명
          </p>

          <div className="pt-8">
            <div
              className={`inline-block px-8 py-4 bg-gradient-to-r from-star-gold/20 to-cosmic-purple/20 rounded-full border border-star-gold/30 backdrop-blur-sm ${
                isHovering && !isRotating ? 'scale-110' : 'scale-100'
              } transition-all duration-300`}
            >
              <p className="text-white text-sm sm:text-base font-medium">
                태양계를 클릭하세요
              </p>
            </div>
          </div>

          {/* Animated scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <svg
              className="w-8 h-8 text-star-gold opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>

        {/* Rotating text - visible when rotating */}
        {isRotating && !showBigBang && (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block px-8 py-4 bg-gradient-to-r from-star-gold/20 to-cosmic-purple/20 rounded-full border border-star-gold/30 backdrop-blur-sm">
              <p className="text-white text-sm sm:text-base font-medium">
                우주로 떠나는 중...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Twinkling stars overlay */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-star-gold rounded-full animate-twinkle"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{ animationDelay: '0.5s' }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-cosmic-purple rounded-full animate-twinkle"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-1 h-1 bg-star-gold rounded-full animate-twinkle"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-nebula-pink rounded-full animate-twinkle"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Loading progress bar (during rotation) */}
      {isRotating && !showBigBang && (
        <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-space-black/50">
          <div
            className="h-full bg-gradient-to-r from-star-gold via-cosmic-purple to-nebula-pink animate-progress"
            style={{
              animation: 'progress 3s linear forwards',
            }}
          />
        </div>
      )}

      {/* Big Bang Flash Transition Effect */}
      {showBigBang && (
        <div
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 30%, rgba(255, 255, 255, 0) 100%)',
            animation: 'bigBangFlash 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          }}
        >
          {/* Expanding circle effect */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '10px',
              height: '10px',
              background: 'white',
              borderRadius: '50%',
              animation: 'expandCircle 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              boxShadow: '0 0 100px 50px rgba(255, 255, 255, 0.8)',
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        @keyframes bigBangFlash {
          0% {
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes expandCircle {
          0% {
            width: 10px;
            height: 10px;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            width: 200vmax;
            height: 200vmax;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
