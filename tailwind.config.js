/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        moss: '#3E2B1E',
        ink: '#2A1F16',
        linen: '#F7F4EE',
        ochre: '#CC5500',
        sage: '#4F754C',
        cream: '#DCE6D8',
        amber: '#C8A76B',
        bronze: '#787058',
        brown: '#3E2B1E'
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['"Work Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      }
    }
  },
  plugins: []
}
