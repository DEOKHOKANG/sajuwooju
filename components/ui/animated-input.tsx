'use client';

import { useState, forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  (
    {
      className,
      label,
      error,
      success,
      icon,
      rightIcon,
      disabled,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    // Determine border color based on state
    const getBorderColor = () => {
      if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500/30';
      if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500/30';
      if (isFocused) return 'border-cosmic-purple focus:border-cosmic-purple focus:ring-cosmic-purple/30';
      return 'border-gray-300 hover:border-gray-400';
    };

    return (
      <div className="relative w-full">
        {/* Floating label */}
        {label && (
          <label
            className={cn(
              'absolute left-3 transition-all duration-300 pointer-events-none z-10',
              'text-gray-500',
              (isFocused || hasValue)
                ? '-top-2.5 text-xs bg-white px-1 text-cosmic-purple'
                : 'top-1/2 -translate-y-1/2 text-base',
              error && (isFocused || hasValue) && 'text-red-500',
              success && (isFocused || hasValue) && 'text-green-500',
              icon && !(isFocused || hasValue) && 'left-10'
            )}
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {icon && (
            <span
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300',
                isFocused ? 'text-cosmic-purple' : 'text-gray-400',
                error && 'text-red-500',
                success && 'text-green-500'
              )}
            >
              {icon}
            </span>
          )}

          {/* Input */}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-xl border-2 outline-none transition-all duration-300',
              'bg-white text-gray-900 placeholder-transparent',
              'focus:ring-4',
              getBorderColor(),
              icon && 'pl-10',
              rightIcon && 'pr-10',
              disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
              className
            )}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <span
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300',
                isFocused ? 'text-cosmic-purple' : 'text-gray-400'
              )}
            >
              {rightIcon}
            </span>
          )}

          {/* Focus glow effect */}
          <div
            className={cn(
              'absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300',
              isFocused && !error ? 'opacity-100' : 'opacity-0'
            )}
            style={{
              boxShadow: '0 0 0 4px rgba(123, 104, 238, 0.1)',
            }}
          />
        </div>

        {/* Error message with shake animation */}
        {error && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1 animate-shake">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Success message */}
        {success && !error && (
          <p className="mt-2 text-sm text-green-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            확인되었습니다
          </p>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = 'AnimatedInput';
