/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'fira-condensed': ['"Fira Sans Condensed"', 'sans-serif'] // Fallback to a generic sans-serif
      }
    },
  },
  plugins: [],
}

