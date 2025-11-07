import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "타이트 사주 | 쫀득하게 들어맞는 사주 궁합 만세력",
  description: "타이트 사주는 AI 기반의 정확한 사주 궁합 분석 서비스를 제공합니다.",
  keywords: ["사주", "궁합", "사주 궁합", "만세력", "연애 운세", "타로"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preload"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
