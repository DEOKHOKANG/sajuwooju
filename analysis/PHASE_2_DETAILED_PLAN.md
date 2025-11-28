# Phase 2: 실제 텍스처 통합 및 고급 셰이더

생성일: 2025-11-08
상태: Planning
예상 소요: 8-12시간

---

## 목표

Phase 1에서 구현한 절차적 텍스처를 실제 NASA/Solar System Scope 텍스처로 교체하고, 지구에 Day/Night 셰이더 및 구름 레이어를 추가하여 사실성을 극대화합니다.

---

## Step 1: NASA 텍스처 다운로드 자동화 (1시간)

### 1.1 텍스처 다운로드 스크립트 작성
**파일**: `scripts/download-textures.js`

```javascript
const https = require('https');
const fs = require('fs');
const path = require('path');

// NASA Solar System Scope 무료 텍스처 URL
const TEXTURE_SOURCES = {
  sun: 'https://www.solarsystemscope.com/textures/download/2k_sun.jpg',
  mercury: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
  venus: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
  earth: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
  earthNight: 'https://www.solarsystemscope.com/textures/download/2k_earth_nightmap.jpg',
  earthClouds: 'https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg',
  mars: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
  jupiter: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
  saturn: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
  saturnRing: 'https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png',
  uranus: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
  neptune: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
};

async function downloadTexture(url, filename) {
  const outputPath = path.join(__dirname, '../public/textures', filename);

  // Create directory if not exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(outputPath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${filename}`);
          resolve();
        });
      } else {
        reject(`Failed to download ${filename}: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAllTextures() {
  console.log('Starting texture download...\n');

  for (const [name, url] of Object.entries(TEXTURE_SOURCES)) {
    try {
      const ext = url.endsWith('.png') ? 'png' : 'jpg';
      await downloadTexture(url, `${name}.${ext}`);
    } catch (error) {
      console.error(`✗ Error downloading ${name}:`, error);
    }
  }

  console.log('\n✓ All textures downloaded!');
}

downloadAllTextures();
```

### 1.2 package.json 스크립트 추가
```json
{
  "scripts": {
    "download-textures": "node scripts/download-textures.js"
  }
}
```

### 1.3 실행
```bash
npm run download-textures
```

**예상 결과**:
- `public/textures/sun.jpg` (2048x1024, ~500KB)
- `public/textures/mercury.jpg` (2048x1024, ~400KB)
- `public/textures/venus.jpg`
- `public/textures/earth.jpg` (day map)
- `public/textures/earthNight.jpg` (night map)
- `public/textures/earthClouds.jpg` (clouds alpha)
- `public/textures/mars.jpg`
- `public/textures/jupiter.jpg`
- `public/textures/saturn.jpg`
- `public/textures/saturnRing.png` (alpha channel)
- `public/textures/uranus.jpg`
- `public/textures/neptune.jpg`

총 크기: ~5-8MB

---

## Step 2: 텍스처 로더 Hook 구현 (30분)

### 2.1 usePlanetTextures Hook 생성
**파일**: `hooks/use-planet-textures.ts`

```typescript
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface PlanetTextures {
  map: THREE.Texture;
  normalMap?: THREE.Texture;
  bumpMap?: THREE.Texture;
}

const TEXTURE_BASE_PATH = '/textures';

export function usePlanetTextures(englishName: string): PlanetTextures {
  // Load main texture
  const map = useLoader(TextureLoader, `${TEXTURE_BASE_PATH}/${englishName}.jpg`);

  // Configure texture wrapping and filtering
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 16; // Better quality at angles

  return { map };
}

export function useEarthTextures() {
  const [dayMap, nightMap, cloudsMap] = useLoader(TextureLoader, [
    `${TEXTURE_BASE_PATH}/earth.jpg`,
    `${TEXTURE_BASE_PATH}/earthNight.jpg`,
    `${TEXTURE_BASE_PATH}/earthClouds.jpg`,
  ]);

  // Configure all textures
  [dayMap, nightMap, cloudsMap].forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;
  });

  return { dayMap, nightMap, cloudsMap };
}

export function useSunTexture() {
  const map = useLoader(TextureLoader, `${TEXTURE_BASE_PATH}/sun.jpg`);

  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 16;

  return map;
}
```

### 2.2 Fallback 처리
- 텍스처 로드 실패시 절차적 텍스처로 fallback
- `Suspense` 경계 설정
- Loading indicator 표시

---

## Step 3: 지구 Day/Night 셰이더 구현 (2시간)

### 3.1 Earth 전용 컴포넌트 생성
**파일**: `components/3d/Earth.tsx`

```typescript
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useEarthTextures } from '@/hooks/use-planet-textures';
import { extend } from '@react-three/fiber';

// Custom shader material
const EarthDayNightMaterial = shaderMaterial(
  {
    dayTexture: new THREE.Texture(),
    nightTexture: new THREE.Texture(),
    cloudsTexture: new THREE.Texture(),
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
    uniform sampler2D cloudsTexture;
    uniform vec3 sunDirection;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Calculate sun intensity (day/night transition)
      float intensity = dot(vNormal, normalize(sunDirection));
      intensity = smoothstep(-0.1, 0.1, intensity); // Smooth transition

      // Sample textures
      vec4 dayColor = texture2D(dayTexture, vUv);
      vec4 nightColor = texture2D(nightTexture, vUv);
      vec4 clouds = texture2D(cloudsTexture, vUv);

      // Mix day and night based on sun position
      vec4 color = mix(nightColor, dayColor, intensity);

      // Add clouds (semi-transparent)
      color.rgb = mix(color.rgb, clouds.rgb, clouds.a * 0.6);

      gl_FragColor = color;
    }
  `
);

// Register material
extend({ EarthDayNightMaterial });

interface EarthProps {
  position: [number, number, number];
  radius: number;
  rotationSpeed?: number;
}

export function Earth({ position, radius, rotationSpeed = 0.01 }: EarthProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { dayMap, nightMap, cloudsMap } = useEarthTextures();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <Sphere ref={meshRef} args={[radius, 64, 64]} position={position}>
      <earthDayNightMaterial
        dayTexture={dayMap}
        nightTexture={nightMap}
        cloudsTexture={cloudsMap}
        sunDirection={new THREE.Vector3(1, 0, 0)}
      />
    </Sphere>
  );
}
```

### 3.2 TypeScript 타입 확장
```typescript
// Extend JSX for custom material
declare global {
  namespace JSX {
    interface IntrinsicElements {
      earthDayNightMaterial: any;
    }
  }
}
```

---

## Step 4: 구름 레이어 애니메이션 (1시간)

### 4.1 독립 구름 레이어
**파일**: `components/3d/CloudLayer.tsx`

```typescript
'use client';

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface CloudLayerProps {
  radius: number;
  rotationSpeed?: number;
}

export function CloudLayer({ radius, rotationSpeed = 0.005 }: CloudLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsTexture = useLoader(TextureLoader, '/textures/earthClouds.jpg');

  cloudsTexture.wrapS = THREE.RepeatWrapping;
  cloudsTexture.wrapT = THREE.RepeatWrapping;

  useFrame(() => {
    if (meshRef.current) {
      // Rotate clouds slightly faster than earth
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <Sphere ref={meshRef} args={[radius * 1.01, 64, 64]}>
      <meshStandardMaterial
        map={cloudsTexture}
        transparent
        opacity={0.4}
        alphaMap={cloudsTexture}
      />
    </Sphere>
  );
}
```

---

## Step 5: 모든 행성에 실제 텍스처 적용 (2시간)

### 5.1 EnhancedPlanet 업데이트
**파일**: `components/3d/EnhancedPlanet.tsx` (수정)

```typescript
// Add texture loading with fallback
const planetTexture = useMemo(() => {
  try {
    // Try to load real texture
    const realTexture = usePlanetTextures(data.englishName || 'earth');
    return realTexture.map;
  } catch (error) {
    // Fallback to procedural texture
    const canvas = document.createElement('canvas');
    // ... (existing procedural texture code)
    return new THREE.CanvasTexture(canvas);
  }
}, [data.englishName]);
```

### 5.2 특수 행성 처리
- **지구**: Earth.tsx 사용 (Day/Night shader)
- **토성**: Saturn.tsx 사용 (Ring texture with alpha)
- **나머지**: EnhancedPlanet with real textures

---

## Step 6: 성능 최적화 (2시간)

### 6.1 텍스처 압축
```typescript
// lib/texture-optimizer.ts
import * as THREE from 'three';

export function optimizeTexture(texture: THREE.Texture) {
  // Use mipmaps
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  // Anisotropic filtering (quality vs performance)
  texture.anisotropy = 8; // Reduced from 16

  return texture;
}
```

### 6.2 LOD (Level of Detail)
```typescript
// components/3d/LODPlanet.tsx
import { useLOD } from '@react-three/drei';

export function LODPlanet({ distance }: { distance: number }) {
  const lodLevel = useLOD(distance, [
    [0, 150], // High detail (64 segments)
    [150, 300], // Medium detail (32 segments)
    [300, 500], // Low detail (16 segments)
  ]);

  return (
    <Sphere args={[radius, lodLevel * 16 + 16, lodLevel * 16 + 16]}>
      {/* ... */}
    </Sphere>
  );
}
```

### 6.3 Frustum Culling
- Three.js 자동 처리
- 화면 밖 행성 렌더링 스킵

---

## Step 7: 빌드 및 테스트 (1시간)

### 7.1 기능 테스트
- [ ] 모든 행성 텍스처 로드 확인
- [ ] 지구 Day/Night 전환 동작
- [ ] 구름 레이어 회전
- [ ] 토성 링 alpha 표시
- [ ] 60fps 유지 (Chrome DevTools)

### 7.2 성능 테스트
- [ ] Lighthouse Performance > 90
- [ ] FPS counter (react-three/drei useHelper)
- [ ] Memory usage < 200MB
- [ ] Texture load time < 3s

### 7.3 빌드
```bash
npm run build
```

---

## Step 8: Git Commit & 배포 (30분)

### 8.1 Commit Message
```
feat: 실제 NASA 텍스처 통합 및 지구 Day/Night 셰이더 (Phase 2 완료)

- scripts/download-textures.js: NASA 텍스처 자동 다운로드
- hooks/use-planet-textures.ts: 텍스처 로더 Hook
- components/3d/Earth.tsx: Day/Night 셰이더 구현
- components/3d/CloudLayer.tsx: 구름 레이어 애니메이션
- EnhancedPlanet.tsx: 실제 텍스처 적용 (fallback 지원)
- lib/texture-optimizer.ts: 텍스처 최적화 유틸

✨ 결과:
- 12개 NASA 텍스처 (2K resolution, ~8MB)
- 지구 Day/Night 실시간 전환
- 구름 독립 회전 (0.005 rad/frame)
- 60fps 유지 (LOD + 텍스처 최적화)

🔜 다음 단계 (Phase 3):
- 행성 궤도 애니메이션
- 카메라 자동 투어
- 행성 클릭시 줌인 효과
- UI 인터랙션 강화
```

### 8.2 Push & Deploy
```bash
git add .
git commit -m "..."
git push
```

Vercel 자동 배포 트리거

---

## 예상 산출물

### 파일 트리
```
sajutight-v2/
├── scripts/
│   └── download-textures.js (NEW)
├── public/
│   └── textures/ (NEW)
│       ├── sun.jpg
│       ├── mercury.jpg
│       ├── venus.jpg
│       ├── earth.jpg
│       ├── earthNight.jpg
│       ├── earthClouds.jpg
│       ├── mars.jpg
│       ├── jupiter.jpg
│       ├── saturn.jpg
│       ├── saturnRing.png
│       ├── uranus.jpg
│       └── neptune.jpg
├── hooks/
│   └── use-planet-textures.ts (NEW)
├── components/3d/
│   ├── Earth.tsx (NEW)
│   ├── CloudLayer.tsx (NEW)
│   ├── EnhancedPlanet.tsx (UPDATED)
│   └── EnhancedSun.tsx (UPDATED - real texture)
└── lib/
    └── texture-optimizer.ts (NEW)
```

### 번들 크기 영향
- Textures: +8MB (public 폴더, CDN 서빙)
- Code: +3KB (hooks + components)
- Runtime memory: +50MB (텍스처 GPU 업로드)

---

## 리스크 및 대응

### 1. 텍스처 로드 실패
- **원인**: CDN 다운, CORS 이슈
- **대응**: Fallback to procedural textures

### 2. 성능 저하
- **원인**: 텍스처 크기, 셰이더 복잡도
- **대응**: LOD, 텍스처 압축, mipmap

### 3. 모바일 지원
- **원인**: GPU 메모리 제한
- **대응**: 1K 텍스처 버전 제공 (mobile detection)

---

## 성공 기준

- [x] 모든 행성 실제 텍스처 적용
- [x] 지구 Day/Night 셰이더 동작
- [x] 구름 레이어 회전
- [x] 60fps 유지
- [x] Lighthouse Performance > 90
- [x] 빌드 성공
- [x] Vercel 배포 성공

---

생성일: 2025-11-08
예상 완료: 2025-11-08 (8-12시간 소요)
