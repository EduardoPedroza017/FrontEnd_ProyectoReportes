import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal Bechapra - extraída del branding PDF
        bechapra: {
          // Azules principales
          primary: '#0055A5',
          'primary-dark': '#0057D9',
          'primary-light': '#0066CC',
          'primary-hover': '#004690',
          
          // Secundarios
          secondary: '#003366',
          accent: '#00A3E0',
          
          // Fondos claros
          light: '#E8F4FC',
          'light-2': '#F0F7FC',
          'light-3': '#F5FAFD',
          surface: '#FFFFFF',
          muted: '#F5F7FA',
          
          // Bordes
          border: '#D1E3F0',
          'border-light': '#E5EEF5',
          
          // Textos
          text: {
            primary: '#1A365D',
            secondary: '#4A6785',
            muted: '#8BA3BD',
            light: '#A8C4DC',
            inverse: '#FFFFFF'
          },

          // Estados
          success: '#10B981',
          'success-light': '#D1FAE5',
          warning: '#F59E0B',
          'warning-light': '#FEF3C7',
          error: '#EF4444',
          'error-light': '#FEE2E2',
          info: '#3B82F6',
          'info-light': '#DBEAFE',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading': ['1.5rem', { lineHeight: '1.4' }],
        'subheading': ['1.125rem', { lineHeight: '1.5' }],
      },
      boxShadow: {
        'bechapra-sm': '0 2px 8px rgba(0, 85, 165, 0.04)',
        'bechapra': '0 4px 24px rgba(0, 85, 165, 0.08)',
        'bechapra-lg': '0 8px 40px rgba(0, 85, 165, 0.12)',
        'bechapra-xl': '0 16px 64px rgba(0, 85, 165, 0.16)',
        'card': '0 2px 12px rgba(0, 85, 165, 0.06)',
        'card-hover': '0 8px 32px rgba(0, 85, 165, 0.12)',
        'sidebar': '4px 0 24px rgba(0, 85, 165, 0.08)',
        'dropdown': '0 10px 40px rgba(0, 85, 165, 0.15)',
        'button': '0 4px 14px rgba(0, 85, 165, 0.25)',
        'button-hover': '0 6px 20px rgba(0, 85, 165, 0.35)',
      },
      borderRadius: {
        'bechapra-sm': '8px',
        'bechapra': '12px',
        'bechapra-md': '16px',
        'bechapra-lg': '20px',
        'bechapra-xl': '24px',
        'bechapra-2xl': '32px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-bechapra': 'linear-gradient(135deg, #0055A5 0%, #003D7A 100%)',
        'gradient-bechapra-light': 'linear-gradient(135deg, #E8F4FC 0%, #F5FAFD 100%)',
        'gradient-bechapra-radial': 'radial-gradient(ellipse at top, #E8F4FC, #FFFFFF)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}

export default config