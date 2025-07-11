/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.700'),
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.2rem 0.4rem',
              borderRadius: '0.375rem',
              fontSize: '0.875em',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
              borderRadius: '0.75rem',
              padding: '1rem',
            },
            blockquote: {
              borderLeftColor: theme('colors.blue.500'),
              backgroundColor: theme('colors.blue.50'),
              padding: '1rem',
              borderRadius: '0.5rem',
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.300'),
            code: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.200'),
            },
            blockquote: {
              borderLeftColor: theme('colors.blue.400'),
              backgroundColor: theme('colors.blue.900/20'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(156 163 175) transparent',
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(156 163 175)',
            borderRadius: '20px',
            border: '3px solid transparent',
          },
        },
        '.scrollbar-thumb-gray-300': {
          scrollbarColor: 'rgb(209 213 219) transparent',
        },
        '.scrollbar-thumb-gray-600': {
          scrollbarColor: 'rgb(75 85 99) transparent',
        },
        '.scrollbar-track-transparent': {
          scrollbarColor: 'rgb(156 163 175) transparent',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
};