'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { StatsSection } from './stats-section';

// 3D Components (SSR disabled) - Import everything dynamically with error handling
const SpaceCanvas = dynamic(
  () => import('@/components/3d/SpaceCanvas').then((mod) => mod.SpaceCanvas).catch((err) => {
    console.error('Failed to load SpaceCanvas:', err);
    // Return a fallback component
    return { default: () => null };
  }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-white text-sm">우주를 불러오는 중...</div>
      </div>
    )
  }
);

// Dynamically import the RotatingSystem to avoid SSR issues with error handling
const RotatingSystemComponent = dynamic(
  () => import('./RotatingSystemComponent').then((mod) => mod.RotatingSystemComponent).catch((err) => {
    console.error('Failed to load RotatingSystemComponent:', err);
    // Return a fallback component
    return { default: () => null };
  }),
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
  const [isMounted, setIsMounted] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showBigBang, setShowBigBang] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true); // Enable clicking immediately
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Ensure client-side only rendering for 3D components
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-redirect to /main after 3 seconds if user doesn't click
  useEffect(() => {
    const autoRedirectTimer = setTimeout(() => {
      console.log('⏱️ Auto-redirecting to /main after 3 seconds');
      window.location.href = '/main';
    }, 3000);

    return () => {
      clearTimeout(autoRedirectTimer);
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (isRotating) return; // Prevent multiple clicks

    console.log('🚀 Navigation initiated');
    setIsRotating(true);

    // CRITICAL FIX: Immediate fallback navigation (3D is optional)
    // Navigate immediately without waiting for 3D animation
    fallbackTimerRef.current = setTimeout(() => {
      console.log('✅ Direct navigation to /main');
      window.location.href = '/main';
    }, 1500); // 1.5s for visual feedback only
  };

  const handleAnimationComplete = () => {
    // Clear fallback timer if animation completed naturally
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    // Trigger Big Bang flash effect
    setShowBigBang(true);

    // Redirect after flash animation (0.8s)
    setTimeout(() => {
      window.location.href = '/main';
    }, 800);
  };

  // Show loading screen on server-side or before mount
  if (!isMounted) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-glow-pulse mb-4">
            <span className="text-6xl">🌌</span>
          </div>
          <p className="font-display text-xl text-white animate-pulse">
            우주를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-black">
      {/* Hero Section - Full screen with solar system */}
      <div className="relative w-full h-screen overflow-hidden">
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

      {/* Welcome Text Overlay - Centered naturally */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4">
        {/* Initial welcome text - hidden when rotating */}
        <div
          className={`text-center flex flex-col items-center gap-6 transition-opacity duration-1000 ${
            isRotating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            <span className="bg-gradient-to-r from-star-gold via-cosmic-purple to-nebula-pink bg-clip-text text-transparent animate-glow-pulse">
              사주우주
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/90 max-w-2xl">
            우주의 법칙으로 읽는 나의 운명
          </p>

          <div className="pointer-events-auto w-full max-w-xs">
            <button
              onClick={handleClick}
              className={`w-full glass-button px-8 py-4 rounded-full border-2 border-star-gold/40 ${
                isHovering && !isRotating ? 'scale-105 border-star-gold/60' : 'scale-100'
              } transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-star-gold/30 hover:bg-star-gold/10`}
            >
              <span className="text-white text-base sm:text-lg font-semibold">
                사주우주 시작하기
              </span>
            </button>
          </div>
        </div>

        {/* Rotating text - visible when rotating */}
        {isRotating && !showBigBang && (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block px-10 py-5 bg-gradient-to-r from-star-gold/20 to-cosmic-purple/20 rounded-full border-2 border-star-gold/40 backdrop-blur-sm">
              <p className="text-white text-base sm:text-lg font-semibold">
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
              animation: 'progress 4s linear forwards',
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
      {/* End of Hero Section */}

      {/* Stats Section - Scrollable below hero */}
      <StatsSection />
    </div>
  );
}
