// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      rotate: {
        270: '270deg',
        '-20': '-20deg',
        '-10': '-10deg',
      },
      spacing: {
        '100': '25rem',
      },
      keyframes: {
        'hover-bounce': {
          '0%': { width: '40px' },
          '20%': { width: '100%' },
          '40%': { width: '80%' },
          '60%': { width: '100%' },
          '80%': { width: '90%' },
          '100%': { width: '100%' },
        },
        'unhover-bounce': {
          '0%': { width: '100%' },
          '20%': { width: '0%' },
          '40%': { width: '40px' },
          '60%': { width: '30px' },
          '100%': { width: '40px' },
        },
      },
      animation: {
        'hover-bounce': 'hover-bounce 0.7s ease-out forwards',
        'unhover-bounce': 'unhover-bounce 0.7s ease-out forwards',
      },
    },
  },
  plugins: [],
};