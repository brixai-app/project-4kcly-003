export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#f5e9dc',
          surface: '#fff7ee',
          'surface-hover': '#f3e4d5',
          border: '#e7d6c6',
          primary: '#333333',
          muted: '#6b625a',
          accent: '#007a8a',
          'accent-hover': '#006674',
          'accent-text': '#ffffff',
        },
        bg: '#f5e9dc',
        surface: '#fff7ee',
        'surface-hover': '#f3e4d5',
        accent: '#007a8a',
        'accent-hover': '#006674',
      },
      fontFamily: {
        sans: ['Lora', 'sans-serif'],
        display: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        theme: '18px',
      },
    },
  },
  plugins: [],
};