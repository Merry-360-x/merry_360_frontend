/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FE4F4F', // Brand red color
        secondary: '#FF3B3B', // Darker red
        'accent-blue': '#FE4F4F',
        'accent-green': '#FE4F4F',
        'accent-teal': '#FE4F4F',
        brand: {
          50: '#FFF1F1',
          100: '#FFE1E1',
          200: '#FFC4C4',
          300: '#FEA2A2',
          400: '#FE7676',
          500: '#FE4F4F', // Peach Red primary
          600: '#FF3B3B',
          700: '#F25757',
          800: '#D83434',
          900: '#B22222',
        },
        text: {
          primary: '#484848',
          secondary: '#9A9A9A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        'button': '16px',
        'organic': '30% 70% 70% 30% / 30% 30% 70% 70%',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'slide-in': 'slideInRight 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
