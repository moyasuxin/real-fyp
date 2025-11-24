// Design System - Consistent colors, spacing, and styles
export const colors = {
  // Primary palette
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  // Accent palette
  accent: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  // Success
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    700: '#15803d',
  },
  // Warning
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    700: '#b45309',
  },
  // Error
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    700: '#b91c1c',
  },
  // Neutral/Gray
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
};

export const spacing = {
  xs: '0.5rem', // 8px
  sm: '0.75rem', // 12px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
};

export const borderRadius = {
  sm: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  glow: '0 0 20px rgb(14 165 233 / 0.3)',
  glowPurple: '0 0 20px rgb(168 85 247 / 0.3)',
};

export const typography = {
  fontFamily: {
    sans: 'var(--font-inter), system-ui, -apple-system, sans-serif',
    mono: 'ui-monospace, monospace',
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const animations = {
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  keyframes: {
    fadeIn: 'fadeIn 0.3s ease-in',
    slideUp: 'slideUp 0.3s ease-out',
    slideDown: 'slideDown 0.3s ease-out',
    scaleIn: 'scaleIn 0.2s ease-out',
    shimmer: 'shimmer 2s infinite',
  },
};

// Common component styles
export const componentStyles = {
  card: `bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200`,
  cardHover: `hover:shadow-xl hover:scale-[1.02] hover:border-primary-300 dark:hover:border-primary-600`,
  input: `w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200`,
  button: {
    base: `inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
    primary: `bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`,
    secondary: `bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white`,
    success: `bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white shadow-md hover:shadow-lg`,
    danger: `bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 text-white shadow-md hover:shadow-lg`,
    outline: `border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20`,
    ghost: `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`,
  },
  badge: {
    base: `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium`,
    primary: `bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300`,
    success: `bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300`,
    warning: `bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300`,
    error: `bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300`,
    gray: `bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300`,
  },
};

// Glassmorphism effect
export const glassmorphism = `backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20`;

// Gradient backgrounds
export const gradients = {
  primary: `bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600`,
  dark: `bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`,
  purple: `bg-gradient-to-br from-accent-500 via-accent-600 to-primary-600`,
  mesh: `bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-400 via-accent-500 to-primary-600`,
};
