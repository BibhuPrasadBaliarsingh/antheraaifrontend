import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 24px 70px rgba(15, 23, 42, 0.08)'
      },
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#2563eb',
          600: '#1d4ed8'
        }
      }
    }
  },
  plugins: [forms]
};
