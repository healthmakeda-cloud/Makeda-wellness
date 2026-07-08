/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        moss: '#2B3A2A',
        ink: '#1F2A1E',
        linen: '#EDE7D9',
        ochre: '#B8792F',
        sage: '#8FA382',
        cream: '#FAFAF7'
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
