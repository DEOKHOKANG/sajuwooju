'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLANETS_DATA } from '@/lib/planets-data';
import { EnhancedSun } from '@/components/3d/EnhancedSun';
import { EnhancedPlanet } from '@/components/3d/EnhancedPlanet';
import { Earth } from '@/components/3d/Earth';
import { Saturn } from '@/components/3d/Saturn';

// 3D Components (SSR disabled)
const SpaceCanvas = dynamic(
  () => import('@/components/3d/SpaceCanvas').then((mod) => mod.SpaceCanvas),
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

interface RotatingSystemProps {
  isRotating: boolean;
  onAnimationComplete: () => void;
}

function RotatingSystem({ isRotating, onAnimationComplete }: RotatingSystemProps) {
  const systemGroupRef = useRef<THREE.Group>(null);
  const sunGroupRef = useRef<THREE.Group>(null);
  const planetsGroupRef = useRef<THREE.Group>(null);
  const systemRotationSpeed = useRef(0);
  const sunRotationSpeed = useRef(0);
  const planetsOrbitSpeed = useRef(0);
  const animationTime = useRef(0);
  const ANIMATION_DURATION = 3; // 3 seconds fast rotation

  useFrame((state, delta) => {
    if (isRotating) {
      animationTime.current += delta;

      // Exponential speed increase for all animations
      const speedMultiplier = Math.min(
        0.1 + animationTime.current * 3, // Start slow, increase rapidly
        15 // Max speed
      );

      // System-wide rotation (전체 태양계 회전)
      if (systemGroupRef.current) {
        systemRotationSpeed.current = speedMultiplier * 0.5;
        systemGroupRef.current.rotation.y += systemRotationSpeed.current * delta;
      }

      // Sun self-rotation (태양 자전 - 매우 빠르게)
      if (sunGroupRef.current) {
        sunRotationSpeed.current = speedMultiplier * 2;
        sunGroupRef.current.rotation.y += sunRotationSpeed.current * delta;
      }

      // Planets orbital rotation (행성 공전 - 매우 빠르게)
      if (planetsGroupRef.current) {
        planetsOrbitSpeed.current = speedMultiplier * 1.5;
        planetsGroupRef.current.rotation.y += planetsOrbitSpeed.current * delta;
      }

      // Complete animation after duration
      if (animationTime.current >= ANIMATION_DURATION) {
        onAnimationComplete();
      }
    } else {
      // Normal slow rotation
      if (systemGroupRef.current) {
        systemGroupRef.current.rotation.y += 0.001;
      }
      if (sunGroupRef.current) {
        sunGroupRef.current.rotation.y += 0.005;
      }
      if (planetsGroupRef.current) {
        planetsGroupRef.current.rotation.y += 0.002;
      }
    }
  });

  return (
    <group ref={systemGroupRef}>
      {/* Sun with its own rotation */}
      <group ref={sunGroupRef} position={[0, 0, 0]}>
        <EnhancedSun radius={20} position={[0, 0, 0]} />
      </group>

      {/* Planets orbiting around the sun */}
      <group ref={planetsGroupRef}>
        {PLANETS_DATA.filter((p) => p.englishName !== 'sun').map((planetData) => {
          if (planetData.englishName === 'earth') {
            return (
              <group key={planetData.name} rotation={[0, 0, 0]}>
                {/* Orbit Path */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[planetData.orbitRadius, planetData.orbitRadius + 0.5, 128]} />
                  <meshBasicMaterial
                    color={planetData.color}
                    transparent
                    opacity={0.15}
                    side={2}
                  />
                </mesh>
                {/* Earth component */}
                <group position={[planetData.orbitRadius, 0, 0]}>
                  <Earth
                    position={[0, 0, 0]}
                    radius={planetData.radius}
                    rotationSpeed={planetData.rotationSpeed || 0.02}
                    showAtmosphere={planetData.hasAtmosphere}
                  />
                </group>
              </group>
            );
          }

          if (planetData.englishName === 'saturn') {
            return (
              <group key={planetData.name} rotation={[0, 0, 0]}>
                {/* Orbit Path */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[planetData.orbitRadius, planetData.orbitRadius + 0.5, 128]} />
                  <meshBasicMaterial
                    color={planetData.color}
                    transparent
                    opacity={0.15}
                    side={2}
                  />
                </mesh>
                {/* Saturn component */}
                <group position={[planetData.orbitRadius, 0, 0]}>
                  <Saturn
                    position={[0, 0, 0]}
                    radius={planetData.radius}
                    rotationSpeed={planetData.rotationSpeed || 0.015}
                  />
                </group>
              </group>
            );
          }

          // All other planets
          return (
            <EnhancedPlanet
              key={planetData.name}
              data={planetData}
              showOrbit={true}
              showLabel={false}
            />
          );
        })}
      </group>
    </group>
  );
}

export function CosmicLanding() {
  const router = useRouter();
  const [isRotating, setIsRotating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showBigBang, setShowBigBang] = useState(false);

  const handleClick = () => {
    if (isRotating) return; // Prevent multiple clicks
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
        className={`absolute inset-0 z-10 cursor-pointer transition-all duration-300 ${
          isHovering && !isRotating ? 'scale-105' : 'scale-100'
        }`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <SpaceCanvas
          enableControls={false}
          showStars={true}
          showMilkyWay={true}
          showNebula={true}
          enableBloom={true}
        >
          <RotatingSystem
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
