/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode:"class",
  theme: {
    extend: {
      keyframes: {
        fade: {
            '0%': {
                opacity:'0'
            },
            '100%': {
                opacity: '100'
            },
        }
    },
    animation: {
        fade: 'fade 0.5s ease-in-out',
    }
    },
  },
  plugins: [],
}

