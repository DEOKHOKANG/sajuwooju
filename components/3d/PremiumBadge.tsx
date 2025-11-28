'use client';

import { useRef } from 'react';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * Premium Badge Component
 * Floating lock icon above premium planets
 * 유료 행성 위에 떠있는 잠금 아이콘
 *
 * Features:
 * - 3D lock icon with glow effect
 * - Floating animation
 * - Click-through (doesn't block planet clicks)
 */

interface PremiumBadgeProps {
  /** Position offset from planet center */
  position?: [number, number, number];
  /** Whether to show the badge */
  visible?: boolean;
}

export function PremiumBadge({ position = [0, 15, 0], visible = true }: PremiumBadgeProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Floating animation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      // Slow bobbing motion
      groupRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.5;
      // Slow rotation
      groupRef.current.rotation.y = time * 0.3;
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Lock Icon Background - Glowing Circle */}
      <Sphere args={[2, 16, 16]}>
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Lock Icon - Simplified 3D representation */}
      <group>
        {/* Lock body (rectangle) */}
        <mesh position={[0, -0.5, 0.1]}>
          <boxGeometry args={[1.2, 1, 0.3]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Lock shackle (half-torus) */}
        <mesh position={[0, 0.3, 0.1]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.5, 0.15, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* "Premium" Text */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.8}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        PREMIUM
      </Text>

      {/* Glow effect */}
      <Sphere args={[2.5, 16, 16]}>
        <meshBasicMaterial color="#FFD700" transparent opacity={0.15} side={THREE.BackSide} />
      </Sphere>
    </group>
  );
}
