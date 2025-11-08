'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useEarthTextures } from '@/hooks/use-planet-textures';
import { extend } from '@react-three/fiber';
import { CloudLayer } from './CloudLayer';

/**
 * Earth Component with Day/Night Shader
 * 지구 컴포넌트 - Day/Night 셰이더 및 구름 레이어
 *
 * Features:
 * - Day/Night texture transition based on sun direction
 * - Cloud layer with independent rotation
 * - Atmospheric glow effect
 * - Realistic lighting and shadows
 */

// Custom Day/Night Shader Material
const EarthDayNightMaterial = shaderMaterial(
  // Uniforms
  {
    dayTexture: new THREE.Texture(),
    nightTexture: new THREE.Texture(),
    sunDirection: new THREE.Vector3(1, 0, 0),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform vec3 sunDirection;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Calculate sun intensity (how much this fragment faces the sun)
      float intensity = dot(vNormal, normalize(sunDirection));

      // Smooth transition from night to day
      // -0.1 to 0.1 creates a gradual twilight zone
      intensity = smoothstep(-0.1, 0.1, intensity);

      // Sample both textures
      vec4 dayColor = texture2D(dayTexture, vUv);
      vec4 nightColor = texture2D(nightTexture, vUv);

      // Mix day and night based on sun position
      // intensity = 0 → full night
      // intensity = 1 → full day
      vec4 color = mix(nightColor, dayColor, intensity);

      gl_FragColor = color;
    }
  `
);

// Register the custom material with React Three Fiber
extend({ EarthDayNightMaterial });

// TypeScript declaration for JSX
declare module '@react-three/fiber' {
  interface ThreeElements {
    earthDayNightMaterial: any;
  }
}

interface EarthProps {
  position?: [number, number, number];
  radius?: number;
  rotationSpeed?: number;
  onClick?: () => void;
  showAtmosphere?: boolean;
}

export function Earth({
  position = [0, 0, 0],
  radius = 6,
  rotationSpeed = 0.02,
  onClick,
  showAtmosphere = true,
}: EarthProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Load Earth textures (day, night, clouds)
  const { dayMap, nightMap, cloudsMap } = useEarthTextures();

  // Sun direction (pointing to the sun at origin)
  const sunDirection = useMemo(() => {
    // Calculate direction from Earth position to Sun (0,0,0)
    const direction = new THREE.Vector3(0, 0, 0).sub(new THREE.Vector3(...position));
    return direction.normalize();
  }, [position]);

  // Animate Earth rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group position={position}>
      {/* Main Earth Sphere with Day/Night Shader */}
      <Sphere
        ref={meshRef}
        args={[radius, 64, 64]}
        onClick={onClick}
      >
        <earthDayNightMaterial
          dayTexture={dayMap}
          nightTexture={nightMap}
          sunDirection={sunDirection}
        />
      </Sphere>

      {/* Cloud Layer */}
      <CloudLayer
        earthRadius={radius}
        rotationSpeed={rotationSpeed * 1.25} // Clouds rotate 25% faster
        cloudsTexture={cloudsMap}
        opacity={0.4}
      />

      {/* Atmospheric Glow - Brighter Earth atmosphere */}
      {showAtmosphere && (
        <Sphere args={[radius * 1.05, 32, 32]}>
          <shaderMaterial
            transparent
            side={THREE.BackSide}
            uniforms={{
              glowColor: { value: new THREE.Color('#87CEEB') }, // Sky Blue - 밝은 하늘색
            }}
            vertexShader={`
              varying vec3 vNormal;

              void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform vec3 glowColor;
              varying vec3 vNormal;

              void main() {
                // Fresnel effect for atmosphere - brighter
                float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                vec3 glow = glowColor * intensity * 1.5; // 1.5x brighter
                gl_FragColor = vec4(glow, intensity * 0.6); // More opaque
              }
            `}
          />
        </Sphere>
      )}
    </group>
  );
}
