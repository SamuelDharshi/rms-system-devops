// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"DM Mono"', 'monospace'],
        display: ['"DM Mono"', 'monospace'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      colors: {
        rms: {
          black:        '#1c1c1c',
          dark:         '#2c2c2c',
          yellow:       '#e5e400',
          cream:        '#f7f6f2',
          border:       '#d1d0cb',
          muted:        '#6b7280',
          faint:        '#9ca3af',
          subtle:       '#4b5563',
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0'  },
        },
      },
    },
  },
  plugins: [],
};
