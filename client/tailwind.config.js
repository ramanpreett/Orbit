export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0D17', // Very dark slate/blue for background
        surface: '#1A1D2D', // Slightly lighter for cards
        primary: {
          DEFAULT: '#00ED64', // MongoDB/Render vibrant green
          hover: '#00C853',
        },
        secondary: '#5C6BC0', // Indigo accent
        textMain: '#E0E0E0',
        textMuted: '#9E9E9E',
        borderDark: '#2D3142'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Professional clean font
      }
    },
  },
  plugins: [],
}
