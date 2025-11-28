import type { Config } from 'tailwindcss';

/**
 * 사주우주 (SajuWooju) Tailwind Configuration
 * Cosmic-themed design system with planet colors and animations
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        /* 우주 배경 색상 */
        space: {
          black: '#0A0E27',
          dark: '#1A1F3A',
          navy: '#2D3561',
          midnight: '#151937',
          deep: '#0D1226',
        },

        /* 별빛 & 강조색 */
        star: {
          gold: '#FFD700',
          silver: '#E8E8E8',
          white: '#FFFFFF',
        },
        cosmic: {
          purple: '#7B68EE',
        },
        nebula: {
          pink: '#FF6EC7',
          blue: '#4ECBFF',
        },
        aurora: {
          green: '#00FFB3',
        },
        comet: {
          cyan: '#00D9FF',
        },

        /* 행성 색상 (음양오행 매핑) */
        planet: {
          /* 水 (Water) */
          mercury: '#B8C5D6',
          uranus: '#4FD0E7',
          neptune: '#4169E1',

          /* 金 (Metal) */
          venus: '#FFD700',

          /* 土 (Earth) */
          earth: '#4169E1',
          saturn: '#DAA520',
          pluto: '#8B7355',

          /* 火 (Fire) */
          mars: '#DC143C',

          /* 木 (Wood) */
          jupiter: '#FF8C00',
        },

        /* 태양 */
        sun: {
          yellow: '#FDB813',
          orange: '#FF6B35',
          core: '#FFE66D',
        },

        /* 텍스트 색상 */
        text: {
          primary: '#FFFFFF',
          secondary: '#B8C5D6',
          tertiary: '#7A8499',
          disabled: '#4A5568',
          gold: '#FFD700',
          purple: '#7B68EE',
        },

        /* UI 색상 */
        ui: {
          border: 'rgba(255, 255, 255, 0.1)',
          'border-hover': 'rgba(255, 255, 255, 0.2)',
          divider: 'rgba(255, 255, 255, 0.06)',
          overlay: 'rgba(10, 14, 39, 0.95)',
          glass: 'rgba(255, 255, 255, 0.05)',
          'glass-hover': 'rgba(255, 255, 255, 0.08)',
        },

        /* 상태 색상 */
        status: {
          success: '#00FFB3',
          warning: '#FFD700',
          error: '#FF4757',
          info: '#4ECBFF',
        },

        /* Legacy colors (shadcn compatibility) */
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      /* 폰트 패밀리 */
      fontFamily: {
        display: ['Space Grotesk', 'Pretendard Variable', 'sans-serif'],
        body: ['Pretendard Variable', 'sans-serif'],
        ownglyph: ['Ownglyph Saehayan', 'Pretendard Variable', 'sans-serif'],
      },

      /* 폰트 크기 (8px 기반) */
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }], // 10px
        xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        base: ['1rem', { lineHeight: '1.5rem' }], // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.875rem' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        '5xl': ['3rem', { lineHeight: '1' }], // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }], // 60px
        '7xl': ['4.5rem', { lineHeight: '1' }], // 72px
        '8xl': ['6rem', { lineHeight: '1' }], // 96px
        '9xl': ['8rem', { lineHeight: '1' }], // 128px
      },

      /* 스페이싱 (8px 기반) */
      spacing: {
        '0.5': '4px',
        '1': '8px',
        '1.5': '12px',
        '2': '16px',
        '2.5': '20px',
        '3': '24px',
        '3.5': '28px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '7': '56px',
        '8': '64px',
        '9': '72px',
        '10': '80px',
        '11': '88px',
        '12': '96px',
        '14': '112px',
        '16': '128px',
        '20': '160px',
        '24': '192px',
        '28': '224px',
        '32': '256px',
        '36': '288px',
        '40': '320px',
        '44': '352px',
        '48': '384px',
        '52': '416px',
        '56': '448px',
        '60': '480px',
        '64': '512px',
        '72': '576px',
        '80': '640px',
        '96': '768px',
      },

      /* Border Radius */
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '16px',
        '3xl': '24px',
        full: '9999px',
      },

      /* Box Shadow */
      boxShadow: {
        sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
        DEFAULT: '0 4px 16px rgba(0, 0, 0, 0.4)',
        md: '0 4px 16px rgba(0, 0, 0, 0.4)',
        lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
        xl: '0 16px 48px rgba(0, 0, 0, 0.6)',
        '2xl': '0 24px 64px rgba(0, 0, 0, 0.7)',
        glow: '0 0 24px rgba(123, 104, 238, 0.5)',
        'glow-gold': '0 0 24px rgba(255, 215, 0, 0.6)',
        'glow-blue': '0 0 24px rgba(78, 203, 255, 0.5)',
        'glow-pink': '0 0 24px rgba(255, 110, 199, 0.5)',
        star: '0 0 12px rgba(255, 215, 0, 0.6)',
      },

      /* Animations */
      keyframes: {
        twinkle: {
          '0%, 100%': {
            opacity: '0.3',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.2)',
          },
        },
        orbit: {
          from: {
            transform: 'rotate(0deg) translateX(200px) rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg) translateX(200px) rotate(-360deg)',
          },
        },
        'nebula-pulse': {
          '0%, 100%': {
            filter: 'brightness(1) blur(0px)',
            opacity: '0.6',
          },
          '50%': {
            filter: 'brightness(1.3) blur(4px)',
            opacity: '0.9',
          },
        },
        'shooting-star': {
          '0%': {
            transform: 'translateX(0) translateY(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateX(300px) translateY(300px)',
            opacity: '0',
          },
        },
        'float-dust': {
          '0%, 100%': {
            transform: 'translate(0, 0)',
          },
          '25%': {
            transform: 'translate(10px, -10px)',
          },
          '50%': {
            transform: 'translate(-5px, -20px)',
          },
          '75%': {
            transform: 'translate(-10px, -10px)',
          },
        },
        'sun-rotate': {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
        'planet-spin': {
          from: {
            transform: 'rotateY(0deg)',
          },
          to: {
            transform: 'rotateY(360deg)',
          },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(123, 104, 238, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(123, 104, 238, 0.8)',
          },
        },
        'aurora-flow': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
        'fade-in': {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        'slide-up': {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'scale-in': {
          from: {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        twinkle: 'twinkle 2s ease-in-out infinite',
        orbit: 'orbit 20s linear infinite',
        'nebula-pulse': 'nebula-pulse 4s ease-in-out infinite',
        'shooting-star': 'shooting-star 2s ease-out forwards',
        'float-dust': 'float-dust 8s ease-in-out infinite',
        'sun-rotate': 'sun-rotate 60s linear infinite',
        'planet-spin': 'planet-spin 30s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'aurora-flow': 'aurora-flow 6s ease infinite',
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },

      /* Background Images */
      backgroundImage: {
        'gradient-space':
          'linear-gradient(180deg, #0A0E27 0%, #151937 50%, #2D3561 100%)',
        'gradient-nebula':
          'linear-gradient(135deg, #FF6EC7 0%, #7B68EE 50%, #4ECBFF 100%)',
        'gradient-aurora':
          'linear-gradient(90deg, #00FFB3 0%, #00D9FF 50%, #4ECBFF 100%)',
        'gradient-sun':
          'radial-gradient(circle, #FFE66D 0%, #FDB813 40%, #FF6B35 100%)',
        'gradient-planet-glow':
          'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)',
      },

      /* Backdrop Blur */
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '10px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },

      /* Z-index */
      zIndex: {
        '-1': '-1',
        '0': '0',
        '1': '1',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '100': '100',
        '1000': '1000',
        '10000': '10000',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
