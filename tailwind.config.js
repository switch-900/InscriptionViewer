/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bitcoin: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#fbd9a5',
          300: '#f9c06d',
          400: '#f6a532',
          500: '#f4900b',
          600: '#f97316', // Bitcoin orange
          700: '#c2590c',
          800: '#9a4710',
          900: '#7c3a0e',
        }
      },
      fontFamily: {
        'mono': ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}