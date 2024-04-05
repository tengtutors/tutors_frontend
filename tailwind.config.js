// https://ui.aceternity.com/
const svgToDataUri = require("mini-svg-data-uri");
const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {

        'dark': {
          50: '#EEEEEE',
          100: '#B4B4B4',
          200: '#7B7B7B',
          300: '#6E6E6E',
          400: '#3A3A3A',
          500: '#313131',
          600: '#2A2A2A',
          700: '#222222',
          800: '#191919',
          900: '#111111',
        },

        'primary': '#44268A',
        'secondary': '#406BC3',
        'accent': '#E1F432',

        'basePrimary': '#000000',
        'basePrimaryHover': '#181818',
        'baseSecondary': '#16181C',
        'baseSecondaryHover': '#1D1F23',

        'textPrimary': '#E7E9EA',
        'textSecondary': '#71767B',

      },
      screens: {
        'sm': '550px',
        'md': '800px',
      },
    },
  },
  plugins: [
    require("daisyui"), // https://daisyui.com/
    backgroundDots, // https://ui.aceternity.com/
  ],
}

function backgroundDots({ matchUtilities, theme }) {
  matchUtilities(
    {
      "bg-grid": (value) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
        )}")`,
      }),
      "bg-grid-small": (value) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
        )}")`,
      }),
      "bg-dot": (value) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
        )}")`,
      }),
    },
    { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
  );
}