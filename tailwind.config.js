/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './assets/js/**/*.js',
    './assets/css/**/*.css'
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors usando CSS Variables
        primary: {
          50: 'rgb(var(--color-primary-50-rgb) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100-rgb) / <alpha-value>)', 
          200: 'rgb(var(--color-primary-200-rgb) / <alpha-value>)',
          300: 'rgb(var(--color-primary-300-rgb) / <alpha-value>)',
          400: 'rgb(var(--color-primary-400-rgb) / <alpha-value>)',
          500: 'rgb(var(--color-primary-500-rgb) / <alpha-value>)',
          600: 'rgb(var(--color-primary-600-rgb) / <alpha-value>)',
          700: 'rgb(var(--color-primary-700-rgb) / <alpha-value>)',
          800: 'rgb(var(--color-primary-800-rgb) / <alpha-value>)',
          900: 'rgb(var(--color-primary-900-rgb) / <alpha-value>)',
          DEFAULT: 'var(--color-primary-500)'
        },
        secondary: {
          50: 'rgb(var(--color-secondary-50-rgb) / <alpha-value>)',
          100: 'rgb(var(--color-secondary-100-rgb) / <alpha-value>)',
          200: 'rgb(var(--color-secondary-200-rgb) / <alpha-value>)',
          300: 'rgb(var(--color-secondary-300-rgb) / <alpha-value>)',
          400: 'rgb(var(--color-secondary-400-rgb) / <alpha-value>)',
          500: 'rgb(var(--color-secondary-500-rgb) / <alpha-value>)',
          600: 'rgb(var(--color-secondary-600-rgb) / <alpha-value>)',
          700: 'rgb(var(--color-secondary-700-rgb) / <alpha-value>)',
          800: 'rgb(var(--color-secondary-800-rgb) / <alpha-value>)',
          900: 'rgb(var(--color-secondary-900-rgb) / <alpha-value>)',
          DEFAULT: 'var(--color-secondary-500)'
        },
        // Simplified colors using CSS variables directly
        'brand-primary': 'var(--color-primary-500)',
        'brand-secondary': 'var(--color-secondary-500)',
        'brand-success': 'var(--color-success-500)',
        'brand-error': 'var(--color-error-500)',
        'brand-warning': 'var(--color-warning-500)',
        'brand-info': 'var(--color-info-500)'
      },
      fontFamily: {
        'primary': 'var(--font-family-primary)',
        'heading': 'var(--font-family-heading)'
      },
      fontSize: {
        'xs': 'var(--font-size-xs)',
        'sm': 'var(--font-size-sm)',
        'base': 'var(--font-size-base)',
        'lg': 'var(--font-size-lg)',
        'xl': 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
        '5xl': 'var(--font-size-5xl)'
      },
      fontWeight: {
        'normal': 'var(--font-weight-normal)',
        'medium': 'var(--font-weight-medium)',
        'semibold': 'var(--font-weight-semibold)',
        'bold': 'var(--font-weight-bold)'
      },
      lineHeight: {
        'tight': 'var(--line-height-tight)',
        'normal': 'var(--line-height-normal)',
        'relaxed': 'var(--line-height-relaxed)'
      },
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)'
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        'full': 'var(--radius-full)'
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        'primary': 'var(--shadow-primary)',
        'secondary': 'var(--shadow-secondary)'
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms', 
        'slow': '500ms'
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-primary-hover': 'var(--gradient-primary-hover)',
        'gradient-primary-light': 'var(--gradient-primary-light)',
        'gradient-hero': 'var(--gradient-hero)'
      },
      zIndex: {
        'dropdown': 'var(--z-dropdown)',
        'sticky': 'var(--z-sticky)',
        'fixed': 'var(--z-fixed)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        'modal': 'var(--z-modal)',
        'popover': 'var(--z-popover)',
        'tooltip': 'var(--z-tooltip)',
        'toast': 'var(--z-toast)'
      },
      screens: {
        'sm': '640px',   // var(--breakpoint-sm)
        'md': '768px',   // var(--breakpoint-md)
        'lg': '1024px',  // var(--breakpoint-lg)
        'xl': '1280px',  // var(--breakpoint-xl)
        '2xl': '1536px'  // var(--breakpoint-2xl)
      }
    }
  },
  plugins: [
    // Plugin personalizado para crear clases adicionales
    function({ addComponents, addUtilities, theme }) {
      // Componentes usando variables CSS
      addComponents({
        '.btn': {
          fontFamily: 'var(--font-family-primary)',
          fontWeight: 'var(--font-weight-medium)',
          borderRadius: 'var(--radius-lg)',
          transition: 'var(--transition-bounce)',
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          fontSize: 'var(--font-size-base)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          '&:focus': {
            outline: '2px solid var(--border-focus)',
            outlineOffset: '2px'
          }
        },
        '.btn-primary': {
          background: 'var(--gradient-primary)',
          color: 'var(--text-on-primary)',
          '&:hover': {
            background: 'var(--gradient-primary-hover)',
            transform: 'translateY(-1px)',
            boxShadow: 'var(--shadow-primary)'
          },
          '&:active': {
            transform: 'translateY(0)'
          }
        },
        '.btn-secondary': {
          backgroundColor: 'var(--color-gray-100)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-primary)',
          '&:hover': {
            backgroundColor: 'var(--color-gray-200)',
            transform: 'translateY(-1px)',
            boxShadow: 'var(--shadow-md)'
          }
        },
        '.input': {
          fontFamily: 'var(--font-family-primary)',
          fontSize: 'var(--font-size-base)',
          border: '2px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          transition: 'var(--transition-normal)',
          '&:focus': {
            borderColor: 'var(--border-focus)',
            boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
            outline: 'none'
          }
        },
        '.card': {
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)',
          padding: 'var(--spacing-lg)',
          transition: 'var(--transition-bounce)',
          '&:hover': {
            boxShadow: 'var(--shadow-xl)',
            transform: 'translateY(-2px)'
          }
        },
        '.notification': {
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-md)',
          fontWeight: 'var(--font-weight-medium)',
          fontSize: 'var(--font-size-sm)',
          '&.success': {
            backgroundColor: 'var(--color-success-50)',
            color: 'var(--color-success-700)',
            border: '1px solid var(--color-success-200)'
          },
          '&.error': {
            backgroundColor: 'var(--color-error-50)',
            color: 'var(--color-error-700)',
            border: '1px solid var(--color-error-200)'
          },
          '&.warning': {
            backgroundColor: 'var(--color-warning-50)',
            color: 'var(--color-warning-700)',
            border: '1px solid var(--color-warning-200)'
          },
          '&.info': {
            backgroundColor: 'var(--color-info-50)',
            color: 'var(--color-info-700)',
            border: '1px solid var(--color-info-200)'
          }
        }
      });

      // Utilidades adicionales
      addUtilities({
        '.text-gradient-primary': {
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        },
        '.bg-gradient-primary': {
          background: 'var(--gradient-primary)'
        },
        '.bg-gradient-primary-hover': {
          background: 'var(--gradient-primary-hover)'
        },
        '.bg-gradient-primary-light': {
          background: 'var(--gradient-primary-light)'
        },
        '.bg-gradient-hero': {
          background: 'var(--gradient-hero)'
        }
      });
    },
    
    // Plugin para formularios (opcional)
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ]
}; 