export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#f4e9dc',
          surface: '#fff7ee',
          'surface-hover': '#fff1e4',
          border: '#e6d8c8',
          primary: '#0b1f2a',
          muted: '#4b5a63',
          accent: '#004e89',
          'accent-hover': '#003b67',
          'accent-text': '#ffffff',
        },
        bg: '#f4e9dc',
        surface: '#fff7ee',
        'surface-hover': '#fff1e4',
        accent: '#004e89',
        'accent-hover': '#003b67',
      },
      fontFamily: {
        sans: ['Lora', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      },
      borderRadius: {
        theme: '18px',
      },
    },
  },
  plugins: [],
};