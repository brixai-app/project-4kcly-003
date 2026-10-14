export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F9F6F2',
          surface: '#FFFFFF',
          'surface-hover': '#FFF7EE',
          border: '#E7E1D8',
          primary: '#1F1F1F',
          muted: '#5F5A55',
          accent: '#0B3D91',
          'accent-hover': '#072E6D',
          'accent-text': '#ffffff',
        },
        bg: '#F9F6F2',
        surface: '#FFFFFF',
        'surface-hover': '#FFF7EE',
        accent: '#0B3D91',
        'accent-hover': '#072E6D',
      },
      fontFamily: {
        sans: ['Lora', 'sans-serif'],
        display: ['Playfair Display', 'sans-serif'],
      },
      borderRadius: {
        theme: '16px',
      },
    },
  },
  plugins: [],
};