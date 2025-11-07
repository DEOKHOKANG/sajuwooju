import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals-wooju.css';

/**
 * Space Grotesk Font Configuration
 * Display font for cosmic-themed headings and titles
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

/**
 * Metadata for 사주우주 (SajuWooju)
 * 우주의 법칙으로 읽는 나의 운명
 */
export const metadata: Metadata = {
  title: '사주우주 | 우주의 법칙으로 읽는 나의 운명',
  description:
    '사주우주는 우주의 9개 행성과 음양오행을 기반으로 당신의 사주를 분석합니다. AI 기반의 정확한 운세와 궁합 서비스를 제공합니다.',
  keywords: [
    '사주',
    '사주우주',
    'SajuWooju',
    '운세',
    '궁합',
    '만세력',
    '음양오행',
    '행성',
    '우주',
    '천문학',
    '사주 분석',
  ],
  openGraph: {
    title: '사주우주 | 우주의 법칙으로 읽는 나의 운명',
    description:
      '우주의 9개 행성과 음양오행으로 당신의 사주를 분석합니다.',
    type: 'website',
    locale: 'ko_KR',
    siteName: '사주우주',
  },
  twitter: {
    card: 'summary_large_image',
    title: '사주우주 | 우주의 법칙으로 읽는 나의 운명',
    description:
      '우주의 9개 행성과 음양오행으로 당신의 사주를 분석합니다.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={spaceGrotesk.variable}>
      <head>
        {/* Pretendard Variable Font */}
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

        {/* Ownglyph Saehayan Font */}
        <link
          rel="preload"
          as="style"
          href="https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2402@1.0/Ownglyph_Saehayan.woff2"
          crossOrigin="anonymous"
        />

        {/* Favicon and icons */}
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0A0E27" />
      </head>
      <body className="antialiased font-body bg-space-static text-text-primary">
        {/* Starfield background effect (optional, can be added later) */}
        <div id="starfield-background" className="fixed inset-0 -z-10" />

        {/* Main content */}
        {children}
      </body>
    </html>
  );
}
