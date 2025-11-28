'use client';

import { useState, useRef, useCallback, forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  rippleColor?: string;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export const RippleButton = forwardRef<HTMLButtonElement, RippleButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      rippleColor,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleId = useRef(0);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || isLoading) return;

        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = Math.max(rect.width, rect.height) * 2;

        const newRipple: Ripple = {
          x: x - size / 2,
          y: y - size / 2,
          size,
          id: rippleId.current++,
        };

        setRipples((prev) => [...prev, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);

        onClick?.(e);
      },
      [disabled, isLoading, onClick]
    );

    // Variant styles
    const variantStyles = {
      primary:
        'bg-gradient-to-r from-cosmic-purple to-nebula-pink text-white hover:shadow-lg hover:shadow-cosmic-purple/30',
      secondary:
        'bg-gradient-to-r from-star-gold to-amber-500 text-space-black hover:shadow-lg hover:shadow-star-gold/30',
      ghost:
        'bg-transparent text-gray-700 hover:bg-gray-100',
      outline:
        'bg-transparent border-2 border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10',
      danger:
        'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg hover:shadow-red-500/30',
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-2xl',
    };

    // Ripple color based on variant
    const defaultRippleColors = {
      primary: 'rgba(255, 255, 255, 0.4)',
      secondary: 'rgba(0, 0, 0, 0.2)',
      ghost: 'rgba(123, 104, 238, 0.3)',
      outline: 'rgba(123, 104, 238, 0.3)',
      danger: 'rgba(255, 255, 255, 0.4)',
    };

    const finalRippleColor = rippleColor || defaultRippleColors[variant];

    return (
      <button
        ref={(node) => {
          (buttonRef as any).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          'relative overflow-hidden font-semibold transition-all duration-300',
          'transform active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-cosmic-purple/50 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: finalRippleColor,
            }}
          />
        ))}

        {/* Loading spinner */}
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}

        {/* Content */}
        <span className={cn('relative z-10 flex items-center justify-center gap-2', isLoading && 'opacity-0')}>
          {children}
        </span>
      </button>
    );
  }
);

RippleButton.displayName = 'RippleButton';
