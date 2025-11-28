'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ProgressBar, CircularProgress } from './ui/progress-bar';
import {
  LOADING_MESSAGES,
  SHORT_LOADING_MESSAGES,
  getMessageByTime,
  LoadingMessage,
} from '@/lib/loading-messages';

// Dynamically import 3D components
const SpaceCanvas = dynamic(
  () => import('./3d').then((mod) => mod.SpaceCanvas),
  { ssr: false }
);

const LoadingScene = dynamic(
  () => import('./3d/LoadingScene').then((mod) => mod.LoadingScene),
  { ssr: false }
);

/**
 * SajuLoader Component
 * Complete loading experience with 3D planets and progress
 * 완전한 사주 분석 로딩 경험 (3D 행성 + 프로그레스)
 */

interface SajuLoaderProps {
  isLoading?: boolean;
  onComplete?: () => void;
  variant?: 'full' | 'short'; // 전체 메시지 또는 짧은 버전
  mode?: '3d' | 'simple'; // 3D 모드 또는 간단한 모드
}

export function SajuLoader({
  isLoading = true,
  onComplete,
  variant = 'full',
  mode = '3d',
}: SajuLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState<LoadingMessage | null>(
    null
  );
  const [elapsedTime, setElapsedTime] = useState(0);

  const messages =
    variant === 'full' ? LOADING_MESSAGES : SHORT_LOADING_MESSAGES;

  useEffect(() => {
    if (!isLoading) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);

      const result = getMessageByTime(elapsed, messages);
      if (result) {
        setCurrentMessage(result.message);
        setProgress(result.message.progress);

        // Complete when reaching 100%
        if (result.message.progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete?.();
          }, 500);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading, messages, onComplete]);

  if (!isLoading) return null;

  if (mode === 'simple') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-black">
        <div className="w-full max-w-md px-8">
          <div className="text-center mb-8">
            <CircularProgress progress={progress} size={120} />
          </div>

          <p className="text-center text-text-secondary text-lg mb-6 animate-pulse">
            {currentMessage?.text || '분석 중...'}
          </p>

          <ProgressBar
            progress={progress}
            variant="gradient"
            showPercentage={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-space-black overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <SpaceCanvas enableControls={false} showStars={true}>
          <LoadingScene progress={progress} message={currentMessage?.text} />
        </SpaceCanvas>
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between py-12 px-4">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gradient-gold mb-4">
            사주우주
          </h1>
          <p className="text-text-secondary text-lg">
            우주의 법칙으로 읽는 나의 운명
          </p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Progress Section */}
        <div className="w-full max-w-2xl">
          {/* Message */}
          <div className="text-center mb-8 animate-fade-in">
            <p className="font-body text-xl md:text-2xl text-text-primary mb-2">
              {currentMessage?.text || '준비 중...'}
            </p>
            <p className="text-sm text-text-tertiary">
              잠시만 기다려주세요...
            </p>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            progress={progress}
            variant="glow"
            showPercentage={true}
            className="mb-4"
          />

          {/* Loading indicator */}
          <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
            <span className="animate-pulse">●</span>
            <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>
              ●
            </span>
            <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>
              ●
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * SimpleSajuLoader
 * Lightweight version without 3D
 */
export function SimpleSajuLoader({
  isLoading = true,
  onComplete,
}: Omit<SajuLoaderProps, 'mode' | 'variant'>) {
  return (
    <SajuLoader
      isLoading={isLoading}
      onComplete={onComplete}
      variant="short"
      mode="simple"
    />
  );
}
