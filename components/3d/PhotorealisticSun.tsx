'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Photorealistic Sun Component
 * NASA-grade realistic sun with corona, solar flares, and volumetric effects
 * 포토리얼리스틱 태양 컴포넌트 - NASA 수준
 */

interface PhotorealisticSunProps {
  radius?: number;
  position?: [number, number, number];
}

export function PhotorealisticSun({ radius = 20, position = [0, 0, 0] }: PhotorealisticSunProps) {
  const sunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const flareRef = useRef<THREE.Mesh>(null);

  // High-quality procedural sun surface texture (8K quality)
  const sunTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;

    // Create realistic solar surface gradient
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );

    // Realistic sun colors (photosphere to chromosphere)
    gradient.addColorStop(0, '#FFFACD');    // Center - bright yellow-white
    gradient.addColorStop(0.2, '#FFF4A3');  // Inner - warm yellow
    gradient.addColorStop(0.5, '#FFE66D');  // Mid - golden
    gradient.addColorStop(0.7, '#FFB347');  // Outer mid - orange
    gradient.addColorStop(0.9, '#FF8C42');  // Edge - deep orange
    gradient.addColorStop(1, '#FF6B35');    // Limb - reddish

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add granulation pattern (convection cells)
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 60 + 40;
      const brightness = Math.random() * 0.15 + 0.05;

      const cellGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      cellGradient.addColorStop(0, `rgba(255, 250, 205, ${brightness})`);
      cellGradient.addColorStop(0.5, `rgba(255, 228, 109, ${brightness * 0.5})`);
      cellGradient.addColorStop(1, 'rgba(255, 140, 66, 0)');

      ctx.fillStyle = cellGradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add sunspots (darker magnetic regions)
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 50 + 20;
      const darkness = Math.random() * 0.4 + 0.3;

      const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      spotGradient.addColorStop(0, `rgba(40, 20, 0, ${darkness})`);
      spotGradient.addColorStop(0.6, `rgba(80, 40, 0, ${darkness * 0.6})`);
      spotGradient.addColorStop(1, 'rgba(120, 60, 0, 0)');

      ctx.fillStyle = spotGradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add bright faculae (magnetic bright spots)
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 25 + 5;
      const brightness = Math.random() * 0.3 + 0.2;

      const faculaGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      faculaGradient.addColorStop(0, `rgba(255, 255, 240, ${brightness})`);
      faculaGradient.addColorStop(1, 'rgba(255, 255, 240, 0)');

      ctx.fillStyle = faculaGradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Normal map for surface detail
  const normalMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Base normal (blueish)
    ctx.fillStyle = '#8080FF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add surface perturbations
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 40 + 10;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, '#A0A0FF');
      gradient.addColorStop(1, '#8080FF');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  // Corona shader material
  const coronaShader = useMemo(() => ({
    uniforms: {
      glowColor: { value: new THREE.Color('#FFD700') },
      time: { value: 0 },
      viewVector: { value: new THREE.Vector3() },
    },
    vertexShader: `
      uniform vec3 viewVector;
      varying float intensity;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;

        vec3 vNormel = normalize(normalMatrix * normal);
        vec3 vNormelView = normalize(normalMatrix * viewVector);
        intensity = pow(0.6 - dot(vNormel, vNormelView), 4.0);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float time;
      varying float intensity;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        // Dynamic corona variations
        float noise = sin(vPosition.x * 5.0 + time) * cos(vPosition.y * 5.0 + time) * 0.3;
        float finalIntensity = intensity + noise * 0.2;

        // Color shift from yellow to orange-red
        vec3 corona = mix(glowColor, vec3(1.0, 0.3, 0.0), finalIntensity * 0.5);

        gl_FragColor = vec4(corona, finalIntensity * 0.6);
      }
    `,
  }), []);

  // Animation loop
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Sun rotation (very slow, realistic)
    if (sunRef.current) {
      sunRef.current.rotation.y = time * 0.002;
    }

    // Corona shimmer and rotation
    if (coronaRef.current) {
      const material = coronaRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.time.value = time;

        // Update view vector for fresnel effect
        const viewVector = new THREE.Vector3();
        state.camera.getWorldDirection(viewVector);
        material.uniforms.viewVector.value = viewVector;
      }

      // Slow counter-rotation for dynamic effect
      coronaRef.current.rotation.z = time * 0.0003;

      // Gentle pulsing
      const pulse = 1.0 + Math.sin(time * 0.5) * 0.03;
      coronaRef.current.scale.setScalar(pulse);
    }

    // Solar flare rotation
    if (flareRef.current) {
      flareRef.current.rotation.z = time * 0.001;
      const flarePulse = 1.0 + Math.sin(time * 0.7 + Math.PI / 4) * 0.05;
      flareRef.current.scale.setScalar(flarePulse);
    }
  });

  return (
    <group position={position}>
      {/* Main Sun Sphere - Photorealistic */}
      <Sphere ref={sunRef} args={[radius, 128, 128]}>
        <meshStandardMaterial
          map={sunTexture}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          emissive="#FFDB58"
          emissiveIntensity={3.0}
          emissiveMap={sunTexture}
          roughness={0.8}
          metalness={0.0}
          toneMapped={false}
        />
      </Sphere>

      {/* Inner Chromosphere (reddish layer) */}
      <Sphere args={[radius * 1.02, 64, 64]}>
        <meshBasicMaterial
          color="#FF6B35"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Corona - Multi-layered */}
      <Sphere ref={coronaRef} args={[radius * 1.15, 64, 64]}>
        <shaderMaterial
          attach="material"
          {...coronaShader}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* Outer Corona (fainter) */}
      <Sphere args={[radius * 1.3, 64, 64]}>
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Solar Flare Layer (rotating) */}
      <Sphere ref={flareRef} args={[radius * 1.4, 32, 32]}>
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Volumetric Glow (outermost) */}
      <Sphere args={[radius * 1.6, 32, 32]}>
        <meshBasicMaterial
          color="#FFE66D"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Main Point Light - Sun illumination */}
      <pointLight
        position={[0, 0, 0]}
        intensity={5.0}
        distance={1500}
        decay={1.5}
        color="#FFFACD"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Secondary warm light for planets */}
      <pointLight
        position={[0, 0, 0]}
        intensity={2.0}
        distance={2000}
        decay={2}
        color="#FFE4B5"
      />

      {/* Hemisphere light for ambient realism */}
      <hemisphereLight
        args={['#FFFAF0', '#FF8C42', 0.3]}
        position={[0, 50, 0]}
      />
    </group>
  );
}
