export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F7F1E8',
          surface: '#FFFFFF',
          'surface-hover': '#FBF7F0',
          border: '#DED5C8',
          primary: '#141310',
          muted: '#5D584F',
          accent: '#0E4A3A',
          'accent-hover': '#0B3E31',
          'accent-text': '#ffffff',
        },
        bg: '#F7F1E8',
        surface: '#FFFFFF',
        'surface-hover': '#FBF7F0',
        accent: '#0E4A3A',
        'accent-hover': '#0B3E31',
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        display: ['Playfair Display', 'sans-serif'],
      },
      borderRadius: {
        theme: '16px',
      },
    },
  },
  plugins: [],
};