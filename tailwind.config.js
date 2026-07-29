/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      // Custom Gradients
      gradients: {
        'primary': 'linear-gradient(135deg, #1e57b8, #2d9ef8)',
        'secondary': 'linear-gradient(135deg, #4ecdc4, #16a085)',
        'accent': 'linear-gradient(135deg, #2e2e89, #5a43de)'
      },
      /* Fonts */
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [],
  safelist: ['gradient-*'],
}