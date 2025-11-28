"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Root Landing Page
 * Immediately redirects to /main page
 * 루트 페이지 - 즉시 /main으로 리디렉션
 */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Immediate redirect to main page
    router.replace("/main");
  }, [router]);

  // Show nothing during redirect (no loading screen)
  return null;
}
