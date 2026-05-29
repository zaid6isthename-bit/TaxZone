import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:      'var(--brand-primary)',
          'primary-hover': 'var(--brand-primary-hover)',
          'primary-light': 'var(--brand-primary-light)',
          'primary-dark':  'var(--brand-primary-dark)',
          'gradient-start': 'var(--brand-gradient-start)',
          'gradient-end':   'var(--brand-gradient-end)',
        },
        accent: {
          indigo:       'var(--accent-indigo)',
          'indigo-light': 'var(--accent-indigo-light)',
        },
        success:  { DEFAULT: 'var(--success)',  light: 'var(--success-light)' },
        warning:  { DEFAULT: 'var(--warning)',  light: 'var(--warning-light)' },
        danger:   { DEFAULT: 'var(--danger)',   light: 'var(--danger-light)'  },
        info:     { DEFAULT: 'var(--info)',     light: 'var(--info-light)'    },
        gray: {
          50:  'var(--gray-50)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
        },
        surface:  { white: 'var(--surface-white)', gray: 'var(--surface-gray)' },
        sidebar: {
          bg:           'var(--sidebar-bg)',
          'active-bg':    'var(--sidebar-active-bg)',
          'active-text':  'var(--sidebar-active-text)',
          border:       'var(--sidebar-border)',
        }
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body:    ['var(--font-body)'],
        mono:    ['var(--font-mono)'],
      },
      animation: {
        'progress-flow': 'progressFlow 1.5s ease-in-out infinite',
        'fade-in':       'fadeIn 0.3s ease-out',
        'slide-up':      'slideUp 0.35s cubic-bezier(0,0,0.2,1)',
        'shake':         'shake 0.4s ease-in-out',
      },
      keyframes: {
        progressFlow: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn:  {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' }
        },
      }
    },
  },
  plugins: [],
} satisfies Config;
