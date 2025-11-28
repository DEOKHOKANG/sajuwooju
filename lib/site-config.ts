/**
 * Site Configuration System
 * 사이트 설정 시스템 - 로고, 사이트명, 색상 등 커스터마이징
 *
 * 환경변수로 오버라이드 가능:
 * NEXT_PUBLIC_SITE_NAME="사주우주"
 * NEXT_PUBLIC_SITE_LOGO="/logo.svg"
 * NEXT_PUBLIC_SITE_TAGLINE="우주의 법칙으로 읽는 나의 운명"
 * NEXT_PUBLIC_PRIMARY_COLOR="#7B68EE"
 */

export interface SiteConfig {
  // Basic Info
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  url: string;

  // Branding
  logo: {
    light: string;  // Logo for light backgrounds
    dark: string;   // Logo for dark backgrounds
    icon: string;   // Favicon/app icon
    width: number;
    height: number;
  };

  // Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };

  // Social Links
  social: {
    instagram?: string;
    youtube?: string;
    kakao?: string;
    naver?: string;
  };

  // Contact
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };

  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };

  // Business
  business: {
    name: string;
    registration: string;
    ceo: string;
  };
}

// Default configuration - 사주우주
const defaultConfig: SiteConfig = {
  name: '사주우주',
  shortName: '사주우주',
  description: 'AI 기반 프리미엄 사주 상담 서비스',
  tagline: '우주의 법칙으로 읽는 나의 운명',
  url: 'https://sajuwooju.me',

  logo: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
    icon: '/favicon.ico',
    width: 120,
    height: 40,
  },

  colors: {
    primary: '#7B68EE',      // Cosmic Purple
    secondary: '#FF6EC7',    // Nebula Pink
    accent: '#FFD700',       // Star Gold
    background: '#0A0E27',   // Space Black
  },

  social: {
    instagram: 'https://instagram.com/sajuwooju',
    youtube: 'https://youtube.com/@sajuwooju',
    kakao: 'https://pf.kakao.com/sajuwooju',
    naver: 'https://blog.naver.com/sajuwooju',
  },

  contact: {
    email: 'support@sajuwooju.me',
    phone: '02-1234-5678',
  },

  seo: {
    title: '사주우주 - AI 프리미엄 사주 상담',
    description: 'AI 기술과 전통 명리학의 완벽한 조화. 정확한 사주 분석으로 당신의 운명을 읽습니다.',
    keywords: ['사주', '운세', '궁합', '신년운세', '재물운', '연애운', 'AI 사주'],
    ogImage: '/og-image.jpg',
  },

  business: {
    name: '(주)사주우주',
    registration: '123-45-67890',
    ceo: '홍길동',
  },
};

// Environment variable overrides
function getEnvConfig(): Partial<SiteConfig> {
  const overrides: Partial<SiteConfig> = {};

  if (process.env.NEXT_PUBLIC_SITE_NAME) {
    overrides.name = process.env.NEXT_PUBLIC_SITE_NAME;
    overrides.shortName = process.env.NEXT_PUBLIC_SITE_NAME;
  }

  if (process.env.NEXT_PUBLIC_SITE_TAGLINE) {
    overrides.tagline = process.env.NEXT_PUBLIC_SITE_TAGLINE;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    overrides.url = process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.NEXT_PUBLIC_SITE_LOGO) {
    overrides.logo = {
      ...defaultConfig.logo,
      light: process.env.NEXT_PUBLIC_SITE_LOGO,
      dark: process.env.NEXT_PUBLIC_SITE_LOGO,
    };
  }

  if (process.env.NEXT_PUBLIC_PRIMARY_COLOR) {
    overrides.colors = {
      ...defaultConfig.colors,
      primary: process.env.NEXT_PUBLIC_PRIMARY_COLOR,
    };
  }

  return overrides;
}

// Merge default config with environment overrides
export const siteConfig: SiteConfig = {
  ...defaultConfig,
  ...getEnvConfig(),
};

// Helper functions
export function getSiteName(): string {
  return siteConfig.name;
}

export function getSiteTagline(): string {
  return siteConfig.tagline;
}

export function getSiteLogo(variant: 'light' | 'dark' | 'icon' = 'light'): string {
  return siteConfig.logo[variant];
}

export function getPrimaryColor(): string {
  return siteConfig.colors.primary;
}

export function getSecondaryColor(): string {
  return siteConfig.colors.secondary;
}

export function getAccentColor(): string {
  return siteConfig.colors.accent;
}

// Generate CSS variables from config
export function generateCssVariables(): string {
  return `
    :root {
      --site-primary: ${siteConfig.colors.primary};
      --site-secondary: ${siteConfig.colors.secondary};
      --site-accent: ${siteConfig.colors.accent};
      --site-background: ${siteConfig.colors.background};
    }
  `;
}

// SEO metadata generator
export function generateMetadata() {
  return {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    keywords: siteConfig.seo.keywords.join(', '),
    openGraph: {
      title: siteConfig.seo.title,
      description: siteConfig.seo.description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.seo.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.seo.title,
      description: siteConfig.seo.description,
      images: [siteConfig.seo.ogImage],
    },
  };
}

export default siteConfig;
