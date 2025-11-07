'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Planet Component
 * Reusable planet with orbital mechanics and element mapping
 * 재사용 가능한 행성 컴포넌트 - 음양오행 매핑
 */

export interface PlanetData {
  name: string; // 한글 이름 (수성, 금성, etc.)
  element: '水' | '金' | '土' | '火' | '木'; // 음양오행
  color: string; // 행성 색상
  radius: number; // 행성 크기
  orbitRadius: number; // 공전 반경
  orbitSpeed: number; // 공전 속도 (AU/year)
  rotationSpeed?: number; // 자전 속도
  description?: string; // 설명
}

interface PlanetProps {
  data: PlanetData;
  onClick?: () => void;
  showOrbit?: boolean;
  showLabel?: boolean;
}

export function Planet({
  data,
  onClick,
  showOrbit = true,
  showLabel = true,
}: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Animate orbit and rotation
  useFrame((state) => {
    if (groupRef.current) {
      // Orbital motion around sun
      groupRef.current.rotation.y += data.orbitSpeed * 0.001;
    }

    if (planetRef.current) {
      // Planet's own rotation
      const rotSpeed = data.rotationSpeed || 0.01;
      planetRef.current.rotation.y += rotSpeed;

      // Scale effect on hover
      const targetScale = hovered ? 1.2 : 1;
      planetRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Orbit Path */}
      {showOrbit && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.orbitRadius, data.orbitRadius + 0.5, 128]} />
          <meshBasicMaterial
            color={data.color}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Planet at orbit distance */}
      <group position={[data.orbitRadius, 0, 0]}>
        {/* Planet Sphere */}
        <Sphere
          ref={planetRef}
          args={[data.radius, 32, 32]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
        >
          <meshStandardMaterial
            color={data.color}
            roughness={0.7}
            metalness={0.3}
            emissive={data.color}
            emissiveIntensity={hovered ? 0.3 : 0.1}
          />
        </Sphere>

        {/* Planet Glow when hovered */}
        {hovered && (
          <Sphere args={[data.radius * 1.2, 32, 32]}>
            <meshBasicMaterial
              color={data.color}
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </Sphere>
        )}

        {/* Planet Label */}
        {showLabel && (
          <Text
            position={[0, data.radius + 3, 0]}
            fontSize={3}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="#0A0E27"
          >
            {data.name}
          </Text>
        )}

        {/* Element Label */}
        {showLabel && (
          <Text
            position={[0, data.radius + 6, 0]}
            fontSize={2}
            color={data.color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="#0A0E27"
          >
            {data.element}
          </Text>
        )}
      </group>
    </group>
  );
}
