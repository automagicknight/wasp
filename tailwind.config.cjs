const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  colors.pink[50],
          100: colors.pink[100],
          200: colors.pink[200],
          300: colors.pink[300],
          400: colors.pink[400],
          500: colors.pink[500],
          600: colors.pink[600],
          700: colors.pink[700],
          800: colors.pink[800],
          900: colors.pink[900],
        }
      }
    },
  },
}