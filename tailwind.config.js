/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF385C',
          dark: '#E31C5F',
          light: '#FF5A5F',
        },
        secondary: {
          DEFAULT: '#222222',
          light: '#717171',
        },
        neutral: {
          50: '#F7F7F7',
          100: '#F3F3F3',
          200: '#EBEBEB',
          300: '#DDDDDD',
          400: '#A8A8A8',
          500: '#717171',
          600: '#222222',
        }
      },
      fontFamily: {
        sans: ['Circular', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        search: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
        'search-hover': '0 2px 4px rgba(0,0,0,0.18)',
        card: '0 6px 16px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};