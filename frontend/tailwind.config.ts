/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
  colors: {
    primary: 'var(--color-primary)', // sudah benar
    'primary-foreground': 'var(--color-primary-foreground)',
    secondary: 'var(--color-secondary)',
    'secondary-foreground': 'var(--color-secondary-foreground)',
    background: 'var(--color-background)',
    foreground: 'var(--color-text)',
  },
},

  },
  plugins: [],
};
