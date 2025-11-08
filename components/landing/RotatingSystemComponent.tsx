'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLANETS_DATA } from '@/lib/planets-data';
import { PhotorealisticSun } from '@/components/3d/PhotorealisticSun';
import { EnhancedPlanet } from '@/components/3d/EnhancedPlanet';
import { Earth } from '@/components/3d/Earth';
import { Saturn } from '@/components/3d/Saturn';

interface RotatingSystemProps {
  isRotating: boolean;
  onAnimationComplete: () => void;
}

export function RotatingSystemComponent({ isRotating, onAnimationComplete }: RotatingSystemProps) {
  const systemGroupRef = useRef<THREE.Group>(null);
  const sunGroupRef = useRef<THREE.Group>(null);
  const planetsGroupRef = useRef<THREE.Group>(null);
  const systemRotationSpeed = useRef(0);
  const sunRotationSpeed = useRef(0);
  const planetsOrbitSpeed = useRef(0);
  const animationTime = useRef(0);
  const ANIMATION_DURATION = 3; // 3 seconds fast rotation

  useFrame((state, delta) => {
    if (isRotating) {
      animationTime.current += delta;

      // Exponential speed increase for all animations
      const speedMultiplier = Math.min(
        0.1 + animationTime.current * 3, // Start slow, increase rapidly
        15 // Max speed
      );

      // System-wide rotation (전체 태양계 회전)
      if (systemGroupRef.current) {
        systemRotationSpeed.current = speedMultiplier * 0.5;
        systemGroupRef.current.rotation.y += systemRotationSpeed.current * delta;
      }

      // Sun self-rotation (태양 자전 - 매우 빠르게)
      if (sunGroupRef.current) {
        sunRotationSpeed.current = speedMultiplier * 2;
        sunGroupRef.current.rotation.y += sunRotationSpeed.current * delta;
      }

      // Planets orbital rotation (행성 공전 - 매우 빠르게)
      if (planetsGroupRef.current) {
        planetsOrbitSpeed.current = speedMultiplier * 1.5;
        planetsGroupRef.current.rotation.y += planetsOrbitSpeed.current * delta;
      }

      // Complete animation after duration
      if (animationTime.current >= ANIMATION_DURATION) {
        onAnimationComplete();
      }
    } else {
      // Normal slow rotation
      if (systemGroupRef.current) {
        systemGroupRef.current.rotation.y += 0.001;
      }
      if (sunGroupRef.current) {
        sunGroupRef.current.rotation.y += 0.005;
      }
      if (planetsGroupRef.current) {
        planetsGroupRef.current.rotation.y += 0.002;
      }
    }
  });

  return (
    <group ref={systemGroupRef}>
      {/* Photorealistic Sun with its own rotation */}
      <group ref={sunGroupRef} position={[0, 0, 0]}>
        <PhotorealisticSun radius={20} position={[0, 0, 0]} />
      </group>

      {/* Planets orbiting around the sun */}
      <group ref={planetsGroupRef}>
        {PLANETS_DATA.filter((p) => p.englishName !== 'sun').map((planetData) => {
          if (planetData.englishName === 'earth') {
            return (
              <group key={planetData.name} rotation={[0, 0, 0]}>
                {/* Orbit Path */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[planetData.orbitRadius, planetData.orbitRadius + 0.5, 128]} />
                  <meshBasicMaterial
                    color={planetData.color}
                    transparent
                    opacity={0.15}
                    side={2}
                  />
                </mesh>
                {/* Earth component */}
                <group position={[planetData.orbitRadius, 0, 0]}>
                  <Earth
                    position={[0, 0, 0]}
                    radius={planetData.radius}
                    rotationSpeed={planetData.rotationSpeed || 0.02}
                    showAtmosphere={planetData.hasAtmosphere}
                  />
                </group>
              </group>
            );
          }

          if (planetData.englishName === 'saturn') {
            return (
              <group key={planetData.name} rotation={[0, 0, 0]}>
                {/* Orbit Path */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[planetData.orbitRadius, planetData.orbitRadius + 0.5, 128]} />
                  <meshBasicMaterial
                    color={planetData.color}
                    transparent
                    opacity={0.15}
                    side={2}
                  />
                </mesh>
                {/* Saturn component */}
                <group position={[planetData.orbitRadius, 0, 0]}>
                  <Saturn
                    position={[0, 0, 0]}
                    radius={planetData.radius}
                    rotationSpeed={planetData.rotationSpeed || 0.015}
                  />
                </group>
              </group>
            );
          }

          // All other planets
          return (
            <EnhancedPlanet
              key={planetData.name}
              data={planetData}
              showOrbit={true}
              showLabel={false}
            />
          );
        })}
      </group>
    </group>
  );
}
