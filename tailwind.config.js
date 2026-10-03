export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#0b1411',
          surface: '#14241e',
          'surface-hover': '#193028',
          border: '#244337',
          primary: '#ecfdf5',
          muted: '#a7d7c4',
          accent: '#10b981',
          'accent-hover': '#0ea371',
          'accent-text': '#000000',
        },
        bg: '#0b1411',
        surface: '#14241e',
        'surface-hover': '#193028',
        accent: '#10b981',
        'accent-hover': '#0ea371',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Playfair Display', 'sans-serif'],
      },
      borderRadius: {
        theme: '16px',
      },
    },
  },
  plugins: [],
};