/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf6',
          100: '#d7f4e7',
          200: '#b2e8d0',
          300: '#83d7b1',
          400: '#4fc18f',
          500: '#27a773',
          600: '#18875c',
          700: '#156b4c',
          800: '#14553f',
          900: '#124636'
        }
      }
    }
  },
  plugins: []
};
