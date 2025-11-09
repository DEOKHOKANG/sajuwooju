import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // 실제 사이트 색상 (Playwright 분석 결과)
        primary: {
          DEFAULT: "rgb(65, 66, 84)", // #414254
          foreground: "#ffffff",
          light: "rgb(88, 89, 105)", // #585969
          dark: "rgb(51, 51, 51)", // #333333
        },
        secondary: {
          DEFAULT: "rgb(244, 63, 94)", // #F43F5E - 핑크 포인트
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "rgb(71, 85, 105)", // #475569
          foreground: "#ffffff",
          yellow: "rgb(254, 229, 0)", // #FEE500
        },
        muted: {
          DEFAULT: "rgb(248, 250, 252)", // #F8FAFC
          foreground: "rgb(175, 177, 189)", // #AFB1BD
          100: "rgb(243, 244, 246)", // #F3F4F6
          200: "rgb(241, 245, 249)", // #F1F5F9
          300: "rgb(230, 230, 235)", // #E6E6EB
        },
        card: {
          DEFAULT: "rgb(255, 255, 255)",
          foreground: "rgb(65, 66, 84)",
        },
        border: "rgb(221, 221, 221)", // #DDDDDD
        input: "rgb(255, 255, 255)",
        ring: "rgb(65, 66, 84)",
        slate: {
          900: "rgb(15, 23, 42)", // #0F172A
          700: "rgb(51, 51, 51)",
          600: "rgb(65, 66, 84)",
          500: "rgb(71, 85, 105)",
          400: "rgb(88, 89, 105)",
          300: "rgb(175, 177, 189)",
        },
      },
      fontFamily: {
        sans: ["Pretendard Variable", "-apple-system", "BlinkMacSystemFont", "system-ui", "Roboto", "sans-serif"],
        display: ["OnGlyph Saehayan Font", "Pretendard Variable", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        typing: {
          "0%": { width: "0" },
          "100%": { width: "244px" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        typing: "typing 4s steps(60, end) 0.5s forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
