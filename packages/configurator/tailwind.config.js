/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', '../../node_modules/flowbite/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media', // Use media queries for dark mode
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
}
