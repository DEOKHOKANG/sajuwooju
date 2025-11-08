'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import { PROCEDURAL_TEXTURES } from '@/lib/planet-textures';
import { usePlanetTextures } from '@/hooks/use-planet-textures';

/**
 * Enhanced Planet Component
 * 고급 셰이더와 현실적인 효과를 가진 행성 컴포넌트
 */

export interface PlanetData {
  name: string; // 한글 이름
  englishName?: string; // 영문 이름 (텍스처 매핑용)
  element: '水' | '金' | '土' | '火' | '木';
  color: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed?: number;
  description?: string;
  hasAtmosphere?: boolean; // 대기권 효과 여부
  hasRings?: boolean; // 고리 효과 (토성)
}

interface EnhancedPlanetProps {
  data: PlanetData;
  onClick?: () => void;
  showOrbit?: boolean;
  showLabel?: boolean;
}

export function EnhancedPlanet({
  data,
  onClick,
  showOrbit = true,
  showLabel = true,
}: EnhancedPlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Try to load real NASA texture, fallback to procedural
  let realTexture: THREE.Texture | null = null;
  let textureLoadError = false;

  try {
    if (data.englishName && data.englishName !== 'Earth') {
      // Load real texture for planets (Earth uses custom component)
      const { map } = usePlanetTextures(data.englishName.toLowerCase());
      realTexture = map;
    }
  } catch (error) {
    // Texture loading failed, will use fallback
    textureLoadError = true;
  }

  // Fallback: Create procedural gradient texture
  const proceduralTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Get colors from procedural textures
    const textureKey = data.englishName?.toLowerCase() || 'earth';
    const colors = PROCEDURAL_TEXTURES[textureKey] || PROCEDURAL_TEXTURES.earth;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, colors.color);
    gradient.addColorStop(0.5, colors.secondaryColor || colors.color);
    gradient.addColorStop(1, colors.color);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise for surface detail
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const brightness = Math.random() * 30 - 15;
      ctx.fillStyle = `rgba(${brightness > 0 ? 255 : 0}, ${brightness > 0 ? 255 : 0}, ${brightness > 0 ? 255 : 0}, ${Math.abs(brightness) / 255})`;
      ctx.fillRect(x, y, 2, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, [data.englishName]);

  // Use real texture if loaded, otherwise use procedural
  const planetTexture = realTexture || proceduralTexture;

  // Animate orbit and rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += data.orbitSpeed * 0.001;
    }

    if (planetRef.current) {
      const rotSpeed = data.rotationSpeed || 0.01;
      planetRef.current.rotation.y += rotSpeed;

      // Scale effect on hover
      const targetScale = hovered ? 1.2 : 1;
      planetRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }

    // Animate atmosphere pulse
    if (atmosphereRef.current && data.hasAtmosphere) {
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + 1;
      atmosphereRef.current.scale.setScalar(pulse);
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
        {/* Main Planet Sphere with texture */}
        <Sphere
          ref={planetRef}
          args={[data.radius, 64, 64]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
        >
          <meshStandardMaterial
            map={planetTexture}
            roughness={0.8}
            metalness={0.2}
            emissive={data.color}
            emissiveIntensity={hovered ? 0.3 : 0.1}
            bumpScale={0.05}
          />
        </Sphere>

        {/* Atmosphere Glow (if planet has atmosphere) */}
        {data.hasAtmosphere && (
          <Sphere ref={atmosphereRef} args={[data.radius * 1.05, 32, 32]}>
            <shaderMaterial
              transparent
              side={THREE.BackSide}
              uniforms={{
                glowColor: { value: new THREE.Color(data.color) },
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
                  float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                  vec3 glow = glowColor * intensity;
                  gl_FragColor = vec4(glow, intensity * 0.4);
                }
              `}
            />
          </Sphere>
        )}

        {/* Inner Glow when hovered */}
        {hovered && (
          <Sphere args={[data.radius * 1.15, 32, 32]}>
            <meshBasicMaterial
              color={data.color}
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </Sphere>
        )}

        {/* Rings (for Saturn) */}
        {data.hasRings && (
          <mesh rotation={[-Math.PI / 2.2, 0, Math.PI / 8]}>
            <ringGeometry args={[data.radius * 1.2, data.radius * 2.2, 128]} />
            <meshStandardMaterial
              color={data.color}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
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
