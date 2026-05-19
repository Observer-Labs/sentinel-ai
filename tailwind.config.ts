import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './emails/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary: #0F172A Slate-950 scale (hue ~220)
        primary: {
          50:  '#f0f4ff',
          100: '#dce8ff',
          200: '#b9d1ff',
          300: '#85acff',
          400: '#527dff',
          500: '#2952ff',
          600: '#1030f5',
          700: '#0a1fe1',
          800: '#0d1fb5',
          900: '#101e8c',
          950: '#0F172A',
        },
        // Secondary: #EF4444 Red-500 scale
        secondary: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#EF4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Surface layers (slate-950 hue tinted)
        surface: {
          DEFAULT: '#0F172A',
          raised: '#1E293B',
          overlay: '#334155',
        },
        // Text
        foreground: {
          DEFAULT: '#F1F5F9',
          muted: '#94A3B8',
          subtle: '#64748B',
        },
        border: '#1E293B',
        // Severity
        alert: {
          high:   '#EF4444',
          medium: '#F59E0B',
          low:    '#64748B',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      fontSize: {
        'h1': ['2.7125rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['2.17rem',   { lineHeight: '1.25', fontWeight: '600' }],
        'h3': ['1.736rem',  { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        'btn':   '6px',
        'card':  '8px',
        'input': '6px',
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(-4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
