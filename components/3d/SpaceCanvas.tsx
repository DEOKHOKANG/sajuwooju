'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { Suspense } from 'react';

/**
 * SpaceCanvas Component
 * Base 3D canvas for the cosmic solar system
 * 사주우주 3D 우주 캔버스
 */

interface SpaceCanvasProps {
  children?: React.ReactNode;
  enableControls?: boolean;
  showStars?: boolean;
  className?: string;
}

export function SpaceCanvas({
  children,
  enableControls = true,
  showStars = true,
  className = '',
}: SpaceCanvasProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]} // Device pixel ratio for retina displays
      >
        {/* Camera */}
        <PerspectiveCamera
          makeDefault
          position={[0, 50, 300]}
          fov={50}
          near={0.1}
          far={10000}
        />

        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight
          position={[0, 0, 0]}
          intensity={2}
          color="#FFE66D"
          castShadow
        />

        {/* Starfield Background */}
        {showStars && (
          <Suspense fallback={null}>
            <Stars
              radius={100}
              depth={50}
              count={5000}
              factor={4}
              saturation={0}
              fade
              speed={1}
            />
          </Suspense>
        )}

        {/* Scene Content */}
        <Suspense fallback={null}>{children}</Suspense>

        {/* Controls */}
        {enableControls && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={150}
            maxDistance={500}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(3 * Math.PI) / 4}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
        )}
      </Canvas>
    </div>
  );
}

/**
 * Loading Fallback Component
 * Shown while 3D content is loading
 */
export function SpaceCanvasLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-space-black">
      <div className="text-center">
        <div className="animate-glow-pulse mb-4">
          <span className="text-6xl">🌌</span>
        </div>
        <p className="font-display text-xl text-text-secondary animate-pulse">
          우주를 불러오는 중...
        </p>
      </div>
    </div>
  );
}
