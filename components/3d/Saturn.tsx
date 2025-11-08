'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { usePlanetTextures, useSaturnRingTexture } from '@/hooks/use-planet-textures';

/**
 * Saturn Component with Rings
 * 토성 컴포넌트 - 실제 NASA 텍스처와 고리
 *
 * Features:
 * - Real NASA Saturn surface texture
 * - Saturn rings with alpha transparency
 * - Independent ring rotation
 * - Realistic ring tilt (26.7 degrees)
 */

interface SaturnProps {
  position?: [number, number, number];
  radius?: number;
  rotationSpeed?: number;
  ringRotationSpeed?: number;
  onClick?: () => void;
}

export function Saturn({
  position = [0, 0, 0],
  radius = 9,
  rotationSpeed = 0.015,
  ringRotationSpeed = 0.008,
  onClick,
}: SaturnProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Load Saturn textures (planet and ring)
  // Use try-catch for graceful fallback in production
  let saturnTexture: THREE.Texture | null = null;
  let ringTexture: THREE.Texture | null = null;

  try {
    const { map } = usePlanetTextures('saturn');
    saturnTexture = map;
  } catch (error) {
    // Fallback: use default material color
    console.warn('Saturn texture failed to load');
  }

  try {
    ringTexture = useSaturnRingTexture();
  } catch (error) {
    // Fallback: render without rings
    console.warn('Saturn ring texture failed to load');
  }

  // Animate Saturn and ring rotation
  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed;
    }

    if (ringRef.current) {
      // Rings rotate slower than the planet
      ringRef.current.rotation.z += ringRotationSpeed;
    }
  });

  return (
    <group position={position}>
      {/* Main Saturn Sphere */}
      <Sphere
        ref={planetRef}
        args={[radius, 64, 64]}
        onClick={onClick}
      >
        <meshStandardMaterial
          map={saturnTexture}
          roughness={0.7}
          metalness={0.2}
          emissive="#E4C48A"
          emissiveIntensity={0.1}
        />
      </Sphere>

      {/* Saturn Rings - only render if texture loaded */}
      {ringTexture && (
        <>
          <mesh
            ref={ringRef}
            rotation={[-Math.PI / 2.7, 0, 0]} // Tilt angle (26.7 degrees)
          >
            <ringGeometry
              args={[
                radius * 1.3,  // Inner radius
                radius * 2.3,  // Outer radius
                128,           // Theta segments
              ]}
            />
            <meshStandardMaterial
              map={ringTexture}
              alphaMap={ringTexture}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
              roughness={0.8}
              metalness={0.1}
              depthWrite={false}
            />
          </mesh>

          {/* Ring Shadow on Planet (optional, adds realism) */}
          <mesh
            rotation={[-Math.PI / 2.7, 0, 0]}
          >
            <ringGeometry
              args={[
                radius * 1.3,
                radius * 2.3,
                128,
              ]}
            />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.3}
              side={THREE.BackSide}
              depthWrite={false}
            />
          </mesh>
        </>
      )}
    </group>
  );
}
