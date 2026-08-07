/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        moss: '#3A3A38',
        ink: '#232220',
        linen: '#F7F4EE',
        ochre: '#A66A4A',
        sage: '#8D9472',
        cream: '#E7EEE6',
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
