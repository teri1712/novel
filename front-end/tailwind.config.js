/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      aspectRatio: {
        card: '3/4'
      },
      fontFamily: {
        'read-sans': ['Inter']
      }
    }
  },
  plugins: []
};
