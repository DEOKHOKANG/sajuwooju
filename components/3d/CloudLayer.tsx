'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

/**
 * CloudLayer Component
 * 구름 레이어 컴포넌트 - 지구 위를 회전하는 반투명 구름층
 *
 * Features:
 * - Independent rotation (faster than Earth)
 * - Semi-transparent material with alpha map
 * - Slightly larger sphere than Earth for layering effect
 */

interface CloudLayerProps {
  /** Earth's radius to calculate cloud layer size */
  earthRadius: number;
  /** Cloud layer rotation speed (should be faster than Earth) */
  rotationSpeed?: number;
  /** Cloud texture with alpha channel */
  cloudsTexture: THREE.Texture;
  /** Opacity of the cloud layer */
  opacity?: number;
}

export function CloudLayer({
  earthRadius,
  rotationSpeed = 0.025, // Slightly faster than Earth's default 0.02
  cloudsTexture,
  opacity = 0.4,
}: CloudLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animate cloud rotation independently
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <Sphere
      ref={meshRef}
      args={[earthRadius * 1.01, 64, 64]} // Slightly larger than Earth
    >
      <meshPhongMaterial
        map={cloudsTexture}
        alphaMap={cloudsTexture}
        transparent
        opacity={opacity}
        depthWrite={false} // Prevent z-fighting with Earth surface
        side={THREE.FrontSide}
      />
    </Sphere>
  );
}
