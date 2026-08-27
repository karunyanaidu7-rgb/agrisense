/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f3',
          100: '#e1efe4',
          200: '#c4e0cb',
          300: '#99caaa',
          400: '#6bab82',
          500: '#4c9066',
          600: '#3a7550',
          700: '#2f5e41',
          800: '#274b35',
          900: '#203e2d',
          950: '#112219',
        },
        earth: {
          50: '#fcf8f2',
          100: '#f7edde',
          200: '#edd8bb',
          300: '#dfbc90',
          400: '#ce9a65',
          500: '#c08047',
          600: '#b16a3b',
          700: '#945330',
          800: '#77432b',
          900: '#603726',
          950: '#341c12',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
