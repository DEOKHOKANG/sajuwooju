'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PlanetData } from '@/components/3d';
import { ELEMENT_DESCRIPTIONS } from '@/lib/planets-data';

// Dynamically import 3D components (client-side only)
const SpaceCanvas = dynamic(
  () => import('@/components/3d').then((mod) => mod.SpaceCanvas),
  { ssr: false }
);

const SolarSystem = dynamic(
  () => import('@/components/3d').then((mod) => mod.SolarSystem),
  { ssr: false }
);

const PlanetInfoPanel = dynamic(
  () => import('@/components/3d').then((mod) => mod.PlanetInfoPanel),
  { ssr: false }
);

/**
 * Space Test Page
 * 3D 태양계 테스트 페이지
 */
export default function SpaceTestPage() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [showControls, setShowControls] = useState(true);

  return (
    <div className="relative w-full h-screen bg-space-black overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-gradient-gold mb-2">
              사주우주
            </h1>
            <p className="text-text-secondary text-sm">
              우주의 법칙으로 읽는 나의 운명
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowControls(!showControls)}
              className="px-4 py-2 glass rounded-xl text-text-primary hover:glass-hover transition-all"
            >
              {showControls ? '조작 끄기' : '조작 켜기'}
            </button>
          </div>
        </div>
      </header>

      {/* 3D Solar System Canvas */}
      <div className="w-full h-full">
        <SpaceCanvas enableControls={showControls} showStars={true}>
          <SolarSystem
            onPlanetClick={setSelectedPlanet}
            showOrbits={true}
            showLabels={true}
          />
        </SpaceCanvas>
      </div>

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <PlanetInfoPanel
          planet={selectedPlanet}
          onClose={() => setSelectedPlanet(null)}
        />
      )}

      {/* Five Elements Legend */}
      <div className="absolute bottom-8 left-8 z-10">
        <div className="glass rounded-2xl p-6 max-w-sm">
          <h3 className="font-display text-xl font-semibold text-text-primary mb-4">
            음양오행 (Five Elements)
          </h3>
          <div className="space-y-3">
            {(['水', '金', '土', '火', '木'] as const).map((element) => {
              const info = ELEMENT_DESCRIPTIONS[element];
              return (
                <div key={element} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      backgroundColor:
                        element === '水'
                          ? '#4FD0E7'
                          : element === '金'
                            ? '#FFD700'
                            : element === '土'
                              ? '#DAA520'
                              : element === '火'
                                ? '#DC143C'
                                : '#FF8C00',
                      color: '#0A0E27',
                    }}
                  >
                    {element}
                  </div>
                  <div className="flex-1">
                    <p className="text-text-primary font-medium text-sm">
                      {info.name}
                    </p>
                    <p className="text-text-tertiary text-xs">
                      {info.traits.join(', ')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 z-10">
        <div className="glass rounded-xl p-4 max-w-xs">
          <h4 className="font-display text-sm font-semibold text-text-primary mb-2">
            조작 방법
          </h4>
          <ul className="text-xs text-text-secondary space-y-1">
            <li>• 마우스 드래그: 회전</li>
            <li>• 스크롤: 확대/축소</li>
            <li>• 행성 클릭: 정보 보기</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
