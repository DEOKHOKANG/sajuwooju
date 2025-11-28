'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useSunTexture } from '@/hooks/use-planet-textures';

/**
 * Enhanced Sun Component
 * Advanced sun with corona, solar flares, and layered glow effects
 * 고급 효과를 가진 태양 컴포넌트
 */

interface EnhancedSunProps {
  radius?: number;
  position?: [number, number, number];
}

export function EnhancedSun({ radius = 20, position = [0, 0, 0] }: EnhancedSunProps) {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef1 = useRef<THREE.Mesh>(null);
  const glowRef2 = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);

  // Try to load real NASA sun texture, fallback to procedural
  let realSunTexture: THREE.Texture | null = null;

  try {
    realSunTexture = useSunTexture();
  } catch (error) {
    // Will use procedural texture as fallback
    console.log('Using procedural sun texture as fallback');
  }

  // Fallback: Create procedural sun surface texture with solar flares
  const proceduralSunTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Base gradient (orange to yellow)
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    gradient.addColorStop(0, '#FFF4E6');
    gradient.addColorStop(0.3, '#FFE66D');
    gradient.addColorStop(0.6, '#FDB813');
    gradient.addColorStop(1, '#FF8C00');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add solar flare spots (darker orange spots)
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 80 + 20;
      const opacity = Math.random() * 0.3 + 0.1;

      const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      spotGradient.addColorStop(0, `rgba(255, 100, 0, ${opacity})`);
      spotGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');

      ctx.fillStyle = spotGradient;
      ctx.fillRect(x - size, y - size, size * 2, size * 2);
    }

    // Add bright flare highlights
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 40 + 10;

      const flareGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      flareGradient.addColorStop(0, 'rgba(255, 255, 220, 0.4)');
      flareGradient.addColorStop(1, 'rgba(255, 255, 220, 0)');

      ctx.fillStyle = flareGradient;
      ctx.fillRect(x - size, y - size, size * 2, size * 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Use real texture if loaded, otherwise use procedural
  const sunTexture = realSunTexture || proceduralSunTexture;

  // Animate sun rotation and pulsing effects
  useFrame((state) => {
    if (sunRef.current) {
      // Slow rotation
      sunRef.current.rotation.y += 0.001;
    }

    // Layered pulsing glow effects
    if (glowRef1.current) {
      const pulse1 = Math.sin(state.clock.elapsedTime * 0.5) * 0.08 + 1;
      glowRef1.current.scale.setScalar(pulse1);
    }

    if (glowRef2.current) {
      const pulse2 = Math.sin(state.clock.elapsedTime * 0.3 + Math.PI / 2) * 0.12 + 1;
      glowRef2.current.scale.setScalar(pulse2);
    }

    // Corona shimmer effect
    if (coronaRef.current) {
      const shimmer = Math.sin(state.clock.elapsedTime * 0.7) * 0.05 + 1;
      coronaRef.current.scale.setScalar(shimmer);
      coronaRef.current.rotation.z += 0.0005;
    }
  });

  return (
    <group position={position}>
      {/* Main Sun Sphere with procedural texture */}
      <Sphere ref={sunRef} args={[radius, 64, 64]}>
        <meshStandardMaterial
          map={sunTexture}
          emissive="#FFE66D"
          emissiveIntensity={2.5}
          roughness={0.2}
          metalness={0.1}
        />
      </Sphere>

      {/* Inner Glow Layer 1 (Yellow) */}
      <Sphere ref={glowRef1} args={[radius * 1.08, 32, 32]}>
        <meshBasicMaterial
          color="#FFE66D"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Inner Glow Layer 2 (Orange) */}
      <Sphere ref={glowRef2} args={[radius * 1.15, 32, 32]}>
        <meshBasicMaterial
          color="#FF8C00"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Outer Glow (Red-Orange) */}
      <Sphere args={[radius * 1.25, 32, 32]}>
        <meshBasicMaterial
          color="#FF6B35"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Corona Layer (Shader-based) */}
      <Sphere ref={coronaRef} args={[radius * 1.35, 32, 32]}>
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          uniforms={{
            glowColor: { value: new THREE.Color('#FFD700') },
            time: { value: 0 },
          }}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vPosition;

            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 glowColor;
            varying vec3 vNormal;
            varying vec3 vPosition;

            void main() {
              // Fresnel-like corona effect
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);

              // Add some variation
              float variation = sin(vNormal.x * 10.0) * cos(vNormal.y * 10.0) * 0.1;
              intensity += variation;

              vec3 glow = glowColor * intensity;
              gl_FragColor = vec4(glow, intensity * 0.3);
            }
          `}
        />
      </Sphere>

      {/* Point Light at Sun's center (increased intensity for Bloom) */}
      <pointLight
        position={[0, 0, 0]}
        intensity={3}
        distance={1200}
        decay={2}
        color="#FFE66D"
        castShadow
      />

      {/* Ambient light for overall scene brightness */}
      <pointLight
        position={[0, 0, 0]}
        intensity={0.5}
        distance={2000}
        decay={2}
        color="#FFA500"
      />
    </group>
  );
}
