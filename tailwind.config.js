/** @type {import('tailwindcss').Config} */
/**
 * Density note: html font-size is 80% (see main.css). Prefer rem over px
 * so custom tokens shrink with that root (≈ former Chrome 80% zoom at 100%).
 */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: ['Open Sans', 'sans-serif'],
      body: ['Open Sans', 'sans-serif'],
    },
    extend: {
      fontSize: {
        // was 14px; rem so it tracks html 80% root
        14: '0.875rem',
      },
      // Remap default “blueish” button utilities to ThemeSettings accent
      colors: {
        // Soft neutrals (UI/UX: avoid pure #fff / #000 glare)
        white: 'var(--br24-white, #f8f9fb)',
        black: 'var(--br24-black, #0f172a)',
        blue: {
          50: 'var(--br24-accent-soft-fill)',
          100: 'var(--br24-accent-soft-fill)',
          200: 'var(--br24-accent-soft)',
          300: 'var(--br24-accent)',
          400: 'var(--br24-accent)',
          500: 'var(--br24-accent)',
          600: 'var(--br24-accent)',
          700: 'var(--br24-accent-hover)',
          800: 'var(--br24-accent-strong)',
          900: 'var(--br24-accent-strong)',
        },
      },
      backgroundColor: {
        'main-bg': '#f1f5f9',
        'main-dark-bg': '#0b1220',
        'secondary-dark-bg': '#1e293b',
        'light-gray': '#f1f5f9',
        'half-transparent': 'rgba(15, 23, 42, 0.45)',
      },
      borderWidth: {
        1: '1px',
      },
      borderColor: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      // Former px widths → rem (÷16) so they follow html 80% root
      width: {
        400: '25rem',
        760: '47.5rem',
        780: '48.75rem',
        800: '50rem',
        1000: '62.5rem',
        1200: '75rem',
        1400: '87.5rem',
      },
      height: {
        80: '5rem',
      },
      minHeight: {
        590: '36.875rem',
      },
      backgroundImage: {
        'hero-pattern':
          "url('https://demos.wrappixel.com/premium-admin-templates/react/flexy-react/main/static/media/welcome-bg-2x-svg.25338f53.svg')",
      },
    },
  },
  plugins: [],
};
