/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media', // Use media queries for dark mode
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}
