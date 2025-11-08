'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

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

  // Load Saturn textures using useTexture from drei
  // useTexture automatically handles Suspense without try-catch
  const [saturnTexture, ringTexture] = useTexture([
    '/textures/saturn.jpg',
    '/textures/saturnRing.png'
  ]);

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

      {/* Saturn Rings - NASA-accurate proportions (2.2× diameter) */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2.7, 0, 0]} // Tilt angle (26.7 degrees)
      >
        <ringGeometry
          args={[
            radius * 1.2,  // Inner radius (gap between planet and rings)
            radius * 2.2,  // Outer radius (NASA: main rings are 2.2× planet diameter)
            128,           // Theta segments
          ]}
        />
        <meshStandardMaterial
          map={ringTexture}
          alphaMap={ringTexture}
          transparent
          opacity={0.98}           // Nearly opaque (Iteration 8: 0.95 → 0.98)
          side={THREE.DoubleSide}
          roughness={0.7}          // Natural matte surface
          metalness={0.15}         // Minimal metallic reflection
          emissive="#B89968"       // Sandy brown-beige (NASA observed colors)
          emissiveIntensity={0.15} // Slightly brighter glow
          depthWrite={false}
        />
      </mesh>

      {/* Ring Shadow on Planet (adds realism) */}
      <mesh
        rotation={[-Math.PI / 2.7, 0, 0]}
      >
        <ringGeometry
          args={[
            radius * 1.2,
            radius * 2.2,  // Match main ring size (NASA-accurate)
            128,
          ]}
        />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.25}  // Subtle shadow
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
