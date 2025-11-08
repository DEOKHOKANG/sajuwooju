'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Nebula Particles Component
 * Mystical colored dust clouds to enhance cosmic atmosphere
 * 성운 입자 효과 - 신비로운 우주 먼지 구름
 *
 * Features:
 * - Multiple colored nebula clouds (purple, pink, blue, cyan)
 * - Soft particle rendering with additive blending
 * - Slow drifting animation
 * - Varying sizes and opacity for depth
 */

interface NebulaParticlesProps {
  /** Number of nebula particles */
  count?: number;
  /** Radius of distribution */
  radius?: number;
  /** Drift speed */
  driftSpeed?: number;
}

export function NebulaParticles({
  count = 200,
  radius = 400,
  driftSpeed = 0.0003,
}: NebulaParticlesProps) {
  const particlesRef = useRef<THREE.Points>(null);

  // Nebula color palette (mystical cosmic colors)
  const nebulaColors = useMemo(
    () => [
      new THREE.Color('#9D4EDD'), // Purple
      new THREE.Color('#E0AAFF'), // Light purple
      new THREE.Color('#FF006E'), // Magenta
      new THREE.Color('#FB5607'), // Orange
      new THREE.Color('#3A86FF'), // Blue
      new THREE.Color('#8338EC'), // Deep purple
      new THREE.Color('#06FFA5'), // Cyan
      new THREE.Color('#F72585'), // Pink
    ],
    []
  );

  // Generate nebula particle positions, colors, and sizes
  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Random spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.3 + Math.random() * 0.7); // Concentrate towards center

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Random color from palette
      const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Large, varying sizes for cloud-like appearance
      sizes[i] = Math.random() * 80 + 40; // 40-120
    }

    return [positions, colors, sizes];
  }, [count, radius, nebulaColors]);

  // Slow drifting animation
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;

      // Slow rotation
      particlesRef.current.rotation.y = time * driftSpeed;
      particlesRef.current.rotation.x = Math.sin(time * driftSpeed * 0.5) * 0.1;
      particlesRef.current.rotation.z = Math.cos(time * driftSpeed * 0.3) * 0.1;

      // Pulse opacity slightly
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Subtle wave motion
        positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.01;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        uniforms={{
          time: { value: 0 },
        }}
        vertexShader={`
          attribute float size;
          attribute vec3 color;

          varying vec3 vColor;

          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;

          void main() {
            // Soft circular gradient
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);

            // Soft falloff
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);

            // Extra softness with exponential falloff
            alpha = pow(alpha, 3.0);

            // Very subtle opacity (0.05 - 0.15)
            alpha *= 0.1;

            gl_FragColor = vec4(vColor, alpha);
          }
        `}
      />
    </points>
  );
}
