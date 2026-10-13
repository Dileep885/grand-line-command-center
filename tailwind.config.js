/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss: {
          950: '#02050d',
          900: '#050b18',
          800: '#081226',
          700: '#0c1a33',
          600: '#122448',
        },
        gold: {
          50: '#fff9e6',
          100: '#fff0c2',
          200: '#ffe18a',
          300: '#ffd15c',
          400: '#f9c444',
          500: '#f2b530',
          600: '#d6941f',
          700: '#a86e16',
          800: '#7c5012',
        },
        tide: {
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#1ea7e0',
          600: '#0b7fb8',
          700: '#0a5f8c',
        },
        straw: {
          300: '#ffe38a',
          400: '#ffd45e',
          500: '#f7c948',
        },
        ruby: {
          400: '#ff6b6b',
          500: '#e63946',
          600: '#c11f2d',
        },
        parchment: {
          100: '#fdf5e2',
          200: '#f4e4c1',
          300: '#e7d0a0',
          400: '#d6b87a',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        techno: ['Rajdhani', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        body: ['Rajdhani', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(6px, -8px, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0%' },
          '100%': { backgroundPosition: '200% 0%' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        spinReverse: {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.06)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        wave: {
          '0%': { transform: 'translateX(0) translateZ(0)' },
          '50%': { transform: 'translateX(-25%) translateZ(0)' },
          '100%': { transform: 'translateX(-50%) translateZ(0)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-7px)' },
          '40%': { transform: 'translateX(7px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { transform: 'translateY(1200%)', opacity: '0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.15' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        drift: 'drift 8s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        spinSlow: 'spinSlow 26s linear infinite',
        spinReverse: 'spinReverse 40s linear infinite',
        pulseGlow: 'pulseGlow 3.2s ease-in-out infinite',
        radar: 'radarSweep 4.5s linear infinite',
        wave: 'wave 18s linear infinite',
        waveSlow: 'wave 30s linear infinite',
        ticker: 'ticker 34s linear infinite',
        shake: 'shake 0.45s ease-in-out',
        scan: 'scan 3.5s linear infinite',
        blink: 'blink 1.4s steps(2, end) infinite',
      },
      boxShadow: {
        'glow-gold': '0 0 22px rgba(242, 181, 48, 0.45), 0 0 60px rgba(242, 181, 48, 0.18)',
        'glow-ocean': '0 0 22px rgba(56, 189, 248, 0.40), 0 0 60px rgba(56, 189, 248, 0.15)',
        'glow-red': '0 0 22px rgba(230, 57, 70, 0.45)',
        'inner-card': 'inset 0 1px 0 rgba(255,255,255,0.08)',
        poster: '0 24px 60px -20px rgba(0,0,0,0.85)',
      },
      backgroundImage: {
        'map-grid':
          'linear-gradient(rgba(242,181,48,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(242,181,48,0.06) 1px, transparent 1px)',
        'radar-conic':
          'conic-gradient(from 0deg, rgba(56,189,248,0) 0deg, rgba(56,189,248,0.35) 60deg, rgba(56,189,248,0) 120deg)',
      },
    },
  },
  plugins: [],
};
