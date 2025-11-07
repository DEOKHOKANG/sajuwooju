'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Sun Component
 * Central sun of the solar system with glow effect
 * 태양 컴포넌트 - 태양계의 중심
 */

interface SunProps {
  radius?: number;
  position?: [number, number, number];
}

export function Sun({ radius = 20, position = [0, 0, 0] }: SunProps) {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Animate sun rotation
  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
    if (glowRef.current) {
      // Pulsing glow effect
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position}>
      {/* Main Sun Sphere */}
      <Sphere ref={sunRef} args={[radius, 64, 64]}>
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FFE66D"
          emissiveIntensity={2}
          roughness={0.3}
          metalness={0.1}
        />
      </Sphere>

      {/* Inner Glow */}
      <Sphere args={[radius * 1.1, 32, 32]}>
        <meshBasicMaterial
          color="#FFE66D"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Outer Glow */}
      <Sphere ref={glowRef} args={[radius * 1.3, 32, 32]}>
        <meshBasicMaterial
          color="#FF6B35"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Point Light at Sun's center */}
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        distance={1000}
        decay={2}
        color="#FFE66D"
        castShadow
      />
    </group>
  );
}
