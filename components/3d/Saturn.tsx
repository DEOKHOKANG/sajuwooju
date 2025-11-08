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

      {/* Saturn Rings - always rendered since Suspense handles loading */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2.7, 0, 0]} // Tilt angle (26.7 degrees)
      >
        <ringGeometry
          args={[
            radius * 1.2,  // Inner radius (closer to planet)
            radius * 5.0,  // Outer radius (iteration 3: 4.5 -> 5.0 for maximum visibility)
            128,           // Theta segments
          ]}
        />
        <meshStandardMaterial
          map={ringTexture}
          alphaMap={ringTexture}
          transparent
          opacity={1.0}           // Iteration 5: 0.9 → 1.0 (fully opaque where texture exists)
          side={THREE.DoubleSide}
          roughness={0.6}          // Iteration 5: 0.8 → 0.6 (less rough = more reflective)
          metalness={0.3}          // Iteration 5: 0.1 → 0.3 (more metallic = brighter)
          emissive="#C9A961"       // Iteration 5: Add warm golden emissive glow
          emissiveIntensity={0.3}  // Iteration 5: Subtle glow for visibility
          depthWrite={false}
        />
      </mesh>

      {/* Ring Shadow on Planet (optional, adds realism) */}
      <mesh
        rotation={[-Math.PI / 2.7, 0, 0]}
      >
        <ringGeometry
          args={[
            radius * 1.2,
            radius * 4.5,  // Match main ring size (iteration 2)
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
    </group>
  );
}
