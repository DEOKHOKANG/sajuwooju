import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "사주우주 | 우주의 법칙으로 읽는 나의 운명",
  description: "사주우주는 우주의 9개 행성과 음양오행을 기반으로 당신의 사주를 분석합니다. AI 기반의 정확한 운세와 궁합 서비스를 제공합니다.",
  keywords: ["사주", "사주우주", "운세", "궁합", "만세력", "음양오행", "행성", "우주", "천문학", "사주 분석"],
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
