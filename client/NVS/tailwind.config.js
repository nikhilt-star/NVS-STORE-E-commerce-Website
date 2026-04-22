/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        nvs: {
          purple: '#5b4490',
          lilac: '#9283b5',
          cream: '#f9f2e8',
          beige: '#f6ddba',
          sand: '#edd3ae',
          brown: '#60482d',
          rose: '#f14f45',
          line: '#e8dfd5',
        },
      },
      fontFamily: {
        body: ['Manrope', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
        playful: ['Bree Serif', 'serif'],
      },
      boxShadow: {
        soft: '0 16px 40px rgba(91, 68, 144, 0.08)',
      },
      borderRadius: {
        pill: '999px',
      },
    },
  },
  plugins: [],
}
