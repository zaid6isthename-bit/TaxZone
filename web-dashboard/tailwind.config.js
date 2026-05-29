/** @type {import('tailwindcss').Config} */
module.exports = {
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
          primary:      '#1A4FBA',
          'primary-hover': '#1641A0',
          'primary-light': '#EBF1FF',
          'primary-dark':  '#0F2E6E',
          'gradient-start': '#4F46E5',
          'gradient-end':   '#1A4FBA',
        },
        accent: {
          indigo:       '#5B4CF5',
          'indigo-light': '#F0EFFE',
        },
        success:  { DEFAULT: '#16A34A',  light: '#DCFCE7' },
        warning:  { DEFAULT: '#D97706',  light: '#FEF3C7' },
        danger:   { DEFAULT: '#DC2626',  light: '#FEE2E2' },
        info:     { DEFAULT: '#0284C7',  light: '#E0F2FE' },
        gray: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        surface:  { white: '#FFFFFF', gray: '#F9FAFB' },
        sidebar: {
          bg:           '#FAFAFA',
          'active-bg':    '#EBF1FF',
          'active-text':  '#1A4FBA',
          border:       '#E5E7EB',
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        full: "9999px",
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
};
