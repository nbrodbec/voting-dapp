/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        blue: {
          50: '#67B3E0',
          100: '#2684BA',
          200: '#2274A5',
          300: '#1D6690',
          700: '#091F67',
          800: '#071952',
          900: '#051138'
        },
        magenta: {
          100: '#BC1058',
          200: '#A40E4C',
          300: '#8D0C42'
        },
        coral: {
          100: '#F6A9A7',
          200: '#F49390',
          300: '#F17D79'
        },
        pink: {
          50: '#fde7e9',
          100: '#F66F7A',
          200: '#F45866',
          300: '#F33F4E'
        }
      }
    },
  },
  plugins: [],
}
