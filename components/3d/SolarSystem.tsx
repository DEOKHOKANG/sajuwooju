'use client';

import { useState } from 'react';
import { EnhancedSun } from './EnhancedSun';
import { EnhancedPlanet, PlanetData } from './EnhancedPlanet';
import { Earth } from './Earth';
import { Saturn } from './Saturn';
import { PLANETS_DATA } from '@/lib/planets-data';

/**
 * SolarSystem Component
 * Complete solar system with Enhanced Sun + 9 planets
 * 완전한 태양계 시스템 (고급 태양 + 9개 행성)
 */

interface SolarSystemProps {
  onPlanetClick?: (planet: PlanetData) => void;
  showOrbits?: boolean;
  showLabels?: boolean;
}

export function SolarSystem({
  onPlanetClick,
  showOrbits = true,
  showLabels = true,
}: SolarSystemProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);

  const handlePlanetClick = (planet: PlanetData) => {
    setSelectedPlanet(planet);
    onPlanetClick?.(planet);
  };

  return (
    <group>
      {/* Central Enhanced Sun with Corona and Flares */}
      <EnhancedSun radius={20} position={[0, 0, 0]} />

      {/* 9 Enhanced Planets - Special handling for Earth and Saturn */}
      {PLANETS_DATA.map((planetData) => {
        // Special handling for Earth (custom Day/Night shader + clouds)
        if (planetData.englishName === 'Earth') {
          // Earth is in orbit, so we need to wrap it in a group that rotates around the sun
          return (
            <group key={planetData.name} rotation={[0, 0, 0]}>
              {/* Orbit Path */}
              {showOrbits && (
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[planetData.orbitRadius, planetData.orbitRadius + 0.5, 128]} />
                  <meshBasicMaterial
                    color={planetData.color}
                    transparent
                    opacity={0.15}
                    side={2}
                  />
                </mesh>
              )}

              {/* Earth component positioned at orbit distance */}
              <group position={[planetData.orbitRadius, 0, 0]}>
                <Earth
                  position={[0, 0, 0]}
                  radius={planetData.radius}
                  rotationSpeed={planetData.rotationSpeed || 0.02}
                  onClick={() => handlePlanetClick(planetData)}
                  showAtmosphere={planetData.hasAtmosphere}
                />
              </group>
            </group>
          );
        }

        // Special handling for Saturn (with rings texture)
        if (planetData.englishName === 'Saturn') {
          return (
            <group key={planetData.name} rotation={[0, 0, 0]}>
              {/* Orbit Path */}
              {showOrbits && (
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[planetData.orbitRadius, planetData.orbitRadius + 0.5, 128]} />
                  <meshBasicMaterial
                    color={planetData.color}
                    transparent
                    opacity={0.15}
                    side={2}
                  />
                </mesh>
              )}

              {/* Saturn component positioned at orbit distance */}
              <group position={[planetData.orbitRadius, 0, 0]}>
                <Saturn
                  position={[0, 0, 0]}
                  radius={planetData.radius}
                  rotationSpeed={planetData.rotationSpeed || 0.015}
                  onClick={() => handlePlanetClick(planetData)}
                />
              </group>
            </group>
          );
        }

        // All other planets use EnhancedPlanet component
        return (
          <EnhancedPlanet
            key={planetData.name}
            data={planetData}
            onClick={() => handlePlanetClick(planetData)}
            showOrbit={showOrbits}
            showLabel={showLabels}
          />
        );
      })}
    </group>
  );
}

/**
 * Planet Info Panel
 * Shows detailed information about selected planet
 */
interface PlanetInfoPanelProps {
  planet: PlanetData | null;
  onClose: () => void;
}

export function PlanetInfoPanel({ planet, onClose }: PlanetInfoPanelProps) {
  if (!planet) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="glass rounded-2xl p-6 max-w-md">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display text-2xl font-semibold text-text-primary mb-1">
              {planet.name}
            </h3>
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: planet.color, color: '#0A0E27' }}
            >
              {planet.element}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="닫기"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {planet.description}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-tertiary">공전 반경</span>
            <p className="text-text-primary font-medium">
              {planet.orbitRadius} AU
            </p>
          </div>
          <div>
            <span className="text-text-tertiary">공전 속도</span>
            <p className="text-text-primary font-medium">
              {planet.orbitSpeed} km/s
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
