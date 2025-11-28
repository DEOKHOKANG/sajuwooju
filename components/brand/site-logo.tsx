'use client';

import Image from 'next/image';
import Link from 'next/link';
import { siteConfig, getSiteLogo, getSiteName } from '@/lib/site-config';
import { cn } from '@/lib/utils';

interface SiteLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
}

export function SiteLogo({
  variant = 'light',
  size = 'md',
  showText = true,
  className,
  href = '/',
}: SiteLogoProps) {
  const logoSrc = getSiteLogo(variant);
  const siteName = getSiteName();

  // Size configurations
  const sizes = {
    sm: {
      logo: { width: 28, height: 28 },
      text: 'text-lg',
      gap: 'gap-1.5',
    },
    md: {
      logo: { width: 36, height: 36 },
      text: 'text-xl',
      gap: 'gap-2',
    },
    lg: {
      logo: { width: 48, height: 48 },
      text: 'text-2xl',
      gap: 'gap-3',
    },
  };

  const sizeConfig = sizes[size];

  const content = (
    <div
      className={cn(
        'flex items-center',
        sizeConfig.gap,
        'transition-transform duration-300 hover:scale-105',
        className
      )}
    >
      {/* Logo Image or Fallback Icon */}
      <div className="relative flex-shrink-0">
        {logoSrc && logoSrc !== '/logo-light.svg' && logoSrc !== '/logo-dark.svg' ? (
          <Image
            src={logoSrc}
            alt={siteName}
            width={sizeConfig.logo.width}
            height={sizeConfig.logo.height}
            className="object-contain"
          />
        ) : (
          // Fallback: Cosmic Icon
          <CosmicIcon size={sizeConfig.logo.width} variant={variant} />
        )}
      </div>

      {/* Site Name */}
      {showText && (
        <span
          className={cn(
            'font-bold font-display tracking-tight',
            sizeConfig.text,
            variant === 'dark' ? 'text-white' : 'text-gray-900'
          )}
        >
          {siteName}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}

// Fallback cosmic icon component
function CosmicIcon({ size, variant }: { size: number; variant: 'light' | 'dark' }) {
  const primaryColor = siteConfig.colors.primary;
  const accentColor = siteConfig.colors.accent;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-500 hover:rotate-12"
    >
      {/* Outer glow */}
      <defs>
        <radialGradient id="cosmicGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cosmicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>
      </defs>

      {/* Glow circle */}
      <circle cx="24" cy="24" r="22" fill="url(#cosmicGlow)" />

      {/* Main planet */}
      <circle
        cx="24"
        cy="24"
        r="16"
        fill="url(#cosmicGradient)"
        className="animate-pulse"
        style={{ animationDuration: '3s' }}
      />

      {/* Orbital ring */}
      <ellipse
        cx="24"
        cy="24"
        rx="22"
        ry="8"
        stroke={accentColor}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
        transform="rotate(-20 24 24)"
      />

      {/* Stars */}
      <circle cx="8" cy="12" r="1.5" fill={accentColor} className="animate-twinkle" />
      <circle cx="40" cy="16" r="1" fill={accentColor} className="animate-twinkle" style={{ animationDelay: '0.3s' }} />
      <circle cx="36" cy="38" r="1.5" fill={accentColor} className="animate-twinkle" style={{ animationDelay: '0.6s' }} />
      <circle cx="12" cy="36" r="1" fill={accentColor} className="animate-twinkle" style={{ animationDelay: '0.9s' }} />

      {/* Highlight */}
      <circle cx="18" cy="18" r="4" fill="white" opacity="0.3" />
    </svg>
  );
}

// Text-only logo variant
export function SiteLogoText({
  size = 'md',
  className,
  href = '/',
}: Omit<SiteLogoProps, 'variant' | 'showText'>) {
  const siteName = getSiteName();

  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const content = (
    <span
      className={cn(
        'font-bold font-display animate-text-gradient',
        sizes[size],
        className
      )}
    >
      {siteName}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}

// Icon-only logo variant
export function SiteLogoIcon({
  size = 'md',
  variant = 'light',
  className,
  href = '/',
}: Omit<SiteLogoProps, 'showText'>) {
  const sizes = {
    sm: 28,
    md: 36,
    lg: 48,
  };

  const content = (
    <div className={cn('inline-flex', className)}>
      <CosmicIcon size={sizes[size]} variant={variant} />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}

export default SiteLogo;
