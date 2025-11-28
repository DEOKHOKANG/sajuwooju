'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense } from 'react';
import { CosmicStarfield } from './CosmicStarfield';
import { MilkyWayGradient } from './MilkyWayGradient';

/**
 * SpaceCanvas Component
 * Base 3D canvas for the cosmic solar system with post-processing effects
 * 사주우주 3D 우주 캔버스 (Bloom 효과 포함)
 */

interface SpaceCanvasProps {
  children?: React.ReactNode;
  enableControls?: boolean;
  showStars?: boolean;
  showMilkyWay?: boolean;
  showNebula?: boolean;
  enableBloom?: boolean;
  className?: string;
}

export function SpaceCanvas({
  children,
  enableControls = true,
  showStars = true,
  showMilkyWay = true,
  showNebula = true,
  enableBloom = true,
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
        {/* Camera - Iteration 4: Closer position + wider FOV for better Saturn ring visibility */}
        <PerspectiveCamera
          makeDefault
          position={[0, 50, 240]}  // Moved from 300 to 240 (20% closer)
          fov={55}                 // Increased from 50 to 55 (10% wider)
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

        {/* Milky Way Gradient Background - Subtle cosmic atmosphere */}
        {showMilkyWay && (
          <Suspense fallback={null}>
            <MilkyWayGradient radius={600} opacity={0.08} rotationSpeed={0.0002} />
          </Suspense>
        )}

        {/* Starfield Background - Photorealistic stars only */}
        {showStars && (
          <Suspense fallback={null}>
            <CosmicStarfield count={12000} />
          </Suspense>
        )}

        {/* Scene Content */}
        <Suspense fallback={null}>{children}</Suspense>

        {/* Post-Processing Effects */}
        {enableBloom && (
          <EffectComposer>
            <Bloom
              intensity={2.0} // Stronger glow for photorealistic sun
              luminanceThreshold={0.7} // Only bright objects glow
              luminanceSmoothing={0.9} // Smooth transition
              mipmapBlur={true} // Better performance and quality
            />
          </EffectComposer>
        )}

        {/* Controls */}
        {enableControls && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={120}  // Adjusted from 150 to allow closer zoom
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
