/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E4573D',
          hover: '#c6432b',
        },
        secondary: '#191C21',
        accent: '#34D399',
        background: '#181716',
        surface: '#191C21',
        border: '#D1CFC7',
        textPrimary: '#FFFFFF',
        textSecondary: '#A1A1AA',
      },
      borderRadius: {
        card: '32px',
        control: '20px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        base: '8px',
        standard: '16px',
        cardPadding: '24px',
        sectionPadding: '80px',
      },
    },
  },
  plugins: [],
}
