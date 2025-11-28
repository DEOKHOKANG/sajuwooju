'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import { PLANETS_DATA } from '@/lib/planets-data';

/**
 * LoadingScene Component
 * 3D rotating planets for loading/analysis state
 * 로딩/분석 중 3D 회전 행성 씬
 */

interface LoadingSceneProps {
  progress?: number; // 0-100
  message?: string;
}

export function LoadingScene({ progress = 0, message }: LoadingSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Rotate the entire planet group
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      // Subtle up/down floating
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 2;
    }
  });

  // Select 5 representative planets (one per element)
  const selectedPlanets = [
    PLANETS_DATA[0], // 수성 (水)
    PLANETS_DATA[1], // 금성 (金)
    PLANETS_DATA[2], // 지구 (土)
    PLANETS_DATA[3], // 화성 (火)
    PLANETS_DATA[4], // 목성 (木)
  ];

  return (
    <group>
      {/* Ambient lighting for visibility */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#FFD700" />

      {/* Rotating planet circle */}
      <group ref={groupRef}>
        {selectedPlanets.map((planet, index) => {
          const angle = (index / selectedPlanets.length) * Math.PI * 2;
          const radius = 40;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;

          return (
            <LoadingPlanet
              key={planet.name}
              planet={planet}
              position={[x, 0, z]}
              index={index}
            />
          );
        })}

        {/* Center glow sphere */}
        <Sphere args={[5, 32, 32]}>
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>

      {/* Loading message text */}
      {message && (
        <Text
          position={[0, -30, 0]}
          fontSize={4}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#0A0E27"
          maxWidth={80}
          textAlign="center"
        >
          {message}
        </Text>
      )}

      {/* Progress percentage */}
      {progress > 0 && (
        <Text
          position={[0, -38, 0]}
          fontSize={3}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#0A0E27"
        >
          {Math.round(progress)}%
        </Text>
      )}
    </group>
  );
}

/**
 * LoadingPlanet Component
 * Individual planet in the loading circle
 */
interface LoadingPlanetProps {
  planet: (typeof PLANETS_DATA)[0];
  position: [number, number, number];
  index: number;
}

function LoadingPlanet({ planet, position, index }: LoadingPlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (planetRef.current) {
      // Individual planet rotation
      planetRef.current.rotation.y += 0.02;
      // Subtle floating animation (each planet slightly different)
      const offset = index * 0.5;
      planetRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.5 + offset) * 1.5;
    }
  });

  return (
    <group position={position}>
      {/* Planet sphere */}
      <Sphere ref={planetRef} args={[planet.radius * 0.8, 32, 32]}>
        <meshStandardMaterial
          color={planet.color}
          roughness={0.6}
          metalness={0.4}
          emissive={planet.color}
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Planet glow */}
      <Sphere args={[planet.radius * 1, 32, 32]}>
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Element label */}
      <Text
        position={[0, planet.radius + 2, 0]}
        fontSize={2}
        color={planet.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#0A0E27"
      >
        {planet.element}
      </Text>
    </group>
  );
}
