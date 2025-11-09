"use client";

import { CosmicLanding } from "@/components/landing/cosmic-landing";
import { Component, ReactNode } from "react";

/**
 * Error Boundary to prevent error page from showing
 * 에러 발생 시 에러 페이지가 표시되지 않도록 처리
 */
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Caught error in HomePage:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Show loading screen instead of error
      return (
        <div className="relative w-full h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-glow-pulse mb-4">
              <span className="text-6xl">🌌</span>
            </div>
            <p className="font-display text-xl text-white animate-pulse">
              우주를 불러오는 중...
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Root Landing Page
 * Shows the cosmic landing page with interactive solar system
 * 루트 랜딩 페이지 - 인터랙티브 태양계
 */
export default function HomePage() {
  return (
    <ErrorBoundary>
      <CosmicLanding />
    </ErrorBoundary>
  );
}
