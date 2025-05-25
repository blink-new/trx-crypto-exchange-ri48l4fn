/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-light': 'var(--color-surface-light)',
        'surface-dark': 'var(--color-surface-dark)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        button: 'var(--color-button)',
        accent: 'var(--color-accent)',
        border: 'var(--color-border)',
        hover: 'var(--color-hover)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)'
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      gridTemplateColumns: {
        // Колонки для адаптации под мобильные устройства
        'mobile': 'repeat(1, minmax(0, 1fr))',
        // Колонки для обычного отображения
        'trading': '1fr 3fr 1fr',
      }
    },
  },
  plugins: [],
};