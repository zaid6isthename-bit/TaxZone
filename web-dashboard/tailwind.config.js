/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /(bg|text|border|ring)-(brand|accent|success|warning|danger|info|surface|sidebar)(-[a-z]+)?(-[a-z]+)?(\/[0-9]+)?/,
      variants: ["hover", "active", "focus", "focus-visible", "group-hover", "data-[state=selected]"],
    },
    {
      pattern: /(bg|text|border|ring)-gray-(50|100|200|300|400|500|600|700|800|900)(\/[0-9]+)?/,
      variants: ["hover", "focus", "group-hover"],
    },
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1A4FBA",
          "primary-hover": "#1641A0",
          "primary-light": "#EBF1FF",
          "primary-dark": "#0F2E6E",
        },
        accent: {
          indigo: "#5B4CF5",
          "indigo-light": "#F0EFFE",
        },
        success: {
          DEFAULT: "#16A34A",
          light: "#DCFCE7",
        },
        warning: {
          DEFAULT: "#D97706",
          light: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#DC2626",
          light: "#FEE2E2",
        },
        info: {
          DEFAULT: "#0284C7",
          light: "#E0F2FE",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        surface: {
          white: "#FFFFFF",
          gray: "#F9FAFB",
          blue: "#EBF1FF",
        },
        sidebar: {
          bg: "#FAFAFA",
          "active-bg": "#EBF1FF",
          "active-text": "#1A4FBA",
          text: "#4B5563",
          border: "#E5E7EB",
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "sans-serif"],
        body: ['"DM Sans"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      fontSize: {
        "text-xs": ["11px", { lineHeight: "1.4" }],
        "text-sm": ["13px", { lineHeight: "1.5" }],
        "text-base": ["15px", { lineHeight: "1.6" }],
        "text-md": ["16px", { lineHeight: "1.5" }],
        "text-lg": ["18px", { lineHeight: "1.4" }],
        "text-xl": ["20px", { lineHeight: "1.3" }],
        "text-2xl": ["24px", { lineHeight: "1.25" }],
        "text-3xl": ["30px", { lineHeight: "1.2" }],
        "text-4xl": ["36px", { lineHeight: "1.1" }],
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
      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.05)",
        sm: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        md: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)",
        lg: "0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04)",
        xl: "0 20px 25px rgba(0,0,0,0.08), 0 8px 10px rgba(0,0,0,0.03)",
      },
      transitionDuration: {
        fast: "100ms",
        base: "200ms",
        slow: "350ms",
        slower: "500ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        decelerate: "cubic-bezier(0, 0, 0.2, 1)",
        accelerate: "cubic-bezier(0.4, 0, 1, 1)",
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
    },
  },
  plugins: [],
};
