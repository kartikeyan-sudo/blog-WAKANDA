/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Black Panther theme colors
        wakanda: {
          purple: '#6A38A5', // Vibrant purple
          darkPurple: '#4A1885', // Deeper purple
          black: '#121212', // Rich black
          gray: '#3D3D3D', // Dark gray
          silver: '#E0E0E0', // Silver accent
          vibranium: '#9381FF', // Vibranium glow (light purple)
        },
      },
      fontFamily: {
        futuristic: ['Orbitron', 'sans-serif'],
      },
      backgroundImage: {
        'wakanda-pattern': "url('/patterns/wakanda-pattern.png')",
      },
    },
  },
  plugins: [],
}
