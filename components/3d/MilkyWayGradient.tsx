'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * Milky Way Gradient Component
 * Adds a mystical galactic gradient background to enhance the cosmic concept
 * 은하수 그라데이션 효과 - 신비로운 우주 컨셉 강화
 *
 * Features:
 * - Spherical gradient mesh wrapping the entire scene
 * - Purple-blue-pink galactic colors
 * - Subtle rotation animation
 * - BackSide rendering for interior effect
 */

interface MilkyWayGradientProps {
  /** Radius of the gradient sphere (should be larger than starfield) */
  radius?: number;
  /** Rotation speed */
  rotationSpeed?: number;
  /** Opacity of the gradient */
  opacity?: number;
}

export function MilkyWayGradient({
  radius = 600,
  rotationSpeed = 0.0002,
  opacity = 0.15,
}: MilkyWayGradientProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Slow rotation animation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.rotation.x += rotationSpeed * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={{
          color1: { value: new THREE.Color('#1a0033') }, // Deep purple
          color2: { value: new THREE.Color('#0d1b4d') }, // Dark blue
          color3: { value: new THREE.Color('#2d1b4d') }, // Purple-blue
          color4: { value: new THREE.Color('#4a0e4e') }, // Deep magenta
          opacity: { value: opacity },
        }}
        vertexShader={`
          varying vec3 vPosition;
          varying vec3 vNormal;
          varying vec2 vUv;

          void main() {
            vPosition = position;
            vNormal = normalize(normalMatrix * normal);
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          uniform vec3 color4;
          uniform float opacity;

          varying vec3 vPosition;
          varying vec3 vNormal;
          varying vec2 vUv;

          // Noise function for variation
          float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
          }

          float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);

            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));

            vec2 u = f * f * (3.0 - 2.0 * f);

            return mix(a, b, u.x) +
                   (c - a) * u.y * (1.0 - u.x) +
                   (d - b) * u.x * u.y;
          }

          void main() {
            // Create vertical gradient based on Y position
            float gradientY = (vPosition.y / 600.0) * 0.5 + 0.5;

            // Create horizontal variation based on X and Z
            float gradientX = (vPosition.x / 600.0) * 0.5 + 0.5;
            float gradientZ = (vPosition.z / 600.0) * 0.5 + 0.5;

            // Combine gradients
            float mixFactor1 = gradientY;
            float mixFactor2 = (gradientX + gradientZ) * 0.5;

            // Add noise for galactic texture
            float noiseValue = noise(vUv * 3.0) * 0.3;

            // Mix colors to create galactic gradient
            vec3 color = mix(color1, color2, mixFactor1);
            color = mix(color, color3, mixFactor2 + noiseValue);
            color = mix(color, color4, noiseValue * 0.5);

            // Add some brightness variation
            float brightness = 1.0 + noiseValue * 0.2;
            color *= brightness;

            gl_FragColor = vec4(color, opacity);
          }
        `}
      />
    </mesh>
  );
}
