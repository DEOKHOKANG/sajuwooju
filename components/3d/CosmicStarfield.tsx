'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CosmicStarfield Component
 * 신비로운 우주 별빛 시스템
 *
 * Features:
 * - 3개 레이어의 별 (멀리/중간/가까이)
 * - 반짝이는 효과 (twinkle)
 * - 색상 변화 (청백색, 금색, 적색 별)
 * - 느린 회전 애니메이션
 */

interface CosmicStarfieldProps {
  count?: number;
}

export function CosmicStarfield({ count = 8000 }: CosmicStarfieldProps) {
  const starsRef1 = useRef<THREE.Points>(null);
  const starsRef2 = useRef<THREE.Points>(null);
  const starsRef3 = useRef<THREE.Points>(null);

  // 별 색상 팔레트 (우주의 신비로운 색상)
  const starColors = useMemo(
    () => [
      new THREE.Color('#FFFFFF'), // 청백색 (가장 흔함)
      new THREE.Color('#E6F0FF'), // 밝은 청백색
      new THREE.Color('#FFE9D6'), // 따뜻한 흰색
      new THREE.Color('#FFD700'), // 금색 (드물게)
      new THREE.Color('#FFA500'), // 주황색 (매우 드물게)
    ],
    []
  );

  // Layer 1: 먼 별들 (작고 많음)
  const [positions1, colors1, sizes1] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // 구형 분포 (spherical distribution)
      const radius = 400 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // 색상 (90% 청백색, 10% 다른 색상)
      const colorIndex = Math.random() < 0.9 ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * starColors.length);
      const color = starColors[colorIndex];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // 크기 (작은 별)
      sizes[i] = Math.random() * 1.5 + 0.5;
    }

    return [positions, colors, sizes];
  }, [count, starColors]);

  // Layer 2: 중간 거리 별들 (중간 크기)
  const [positions2, colors2, sizes2] = useMemo(() => {
    const layerCount = Math.floor(count * 0.3);
    const positions = new Float32Array(layerCount * 3);
    const colors = new Float32Array(layerCount * 3);
    const sizes = new Float32Array(layerCount);

    for (let i = 0; i < layerCount; i++) {
      const radius = 250 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // 색상 (더 다양한 색상)
      const colorIndex = Math.random() < 0.7 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * starColors.length);
      const color = starColors[colorIndex];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 2.5 + 1;
    }

    return [positions, colors, sizes];
  }, [count, starColors]);

  // Layer 3: 가까운 별들 (크고 밝음)
  const [positions3, colors3, sizes3] = useMemo(() => {
    const layerCount = Math.floor(count * 0.1);
    const positions = new Float32Array(layerCount * 3);
    const colors = new Float32Array(layerCount * 3);
    const sizes = new Float32Array(layerCount);

    for (let i = 0; i < layerCount; i++) {
      const radius = 150 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // 색상 (균등 분포)
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 3.5 + 1.5;
    }

    return [positions, colors, sizes];
  }, [count, starColors]);

  // 반짝임 애니메이션 (twinkle)
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Layer 1: 매우 느린 회전
    if (starsRef1.current) {
      starsRef1.current.rotation.y = time * 0.005;
      starsRef1.current.rotation.x = time * 0.003;
    }

    // Layer 2: 느린 회전
    if (starsRef2.current) {
      starsRef2.current.rotation.y = time * 0.01;
      starsRef2.current.rotation.x = time * 0.007;
    }

    // Layer 3: 중간 속도 회전
    if (starsRef3.current) {
      starsRef3.current.rotation.y = time * 0.015;
      starsRef3.current.rotation.x = time * 0.01;
    }
  });

  return (
    <>
      {/* Layer 1: Far stars */}
      <points ref={starsRef1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions1, 3]}
            count={positions1.length / 3}
            array={positions1}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors1, 3]}
            count={colors1.length / 3}
            array={colors1}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes1, 1]}
            count={sizes1.length}
            array={sizes1}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Layer 2: Medium stars */}
      <points ref={starsRef2}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions2, 3]}
            count={positions2.length / 3}
            array={positions2}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors2, 3]}
            count={colors2.length / 3}
            array={colors2}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes2, 1]}
            count={sizes2.length}
            array={sizes2}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.5}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Layer 3: Close stars */}
      <points ref={starsRef3}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions3, 3]}
            count={positions3.length / 3}
            array={positions3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors3, 3]}
            count={colors3.length / 3}
            array={colors3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes3, 1]}
            count={sizes3.length}
            array={sizes3}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={1.0}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
