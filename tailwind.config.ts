import type { Config } from 'tailwindcss'

const orange = '#FF9F43'

// Design tokens taken from the FlowPilot Figma file (desktop 1:580, mobile 2:1005).
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // `.container` is defined in src/index.css so its gutters come from the tokens below.
  corePlugins: { container: false },
  theme: {
    // Default breakpoints plus `wide`: the point where the hero switches to two columns.
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      wide: '1200px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        brand: {
          blue: '#2F5BFF',
          violet: '#7B4DFF',
        },
        ink: '#101828',
        muted: '#667085',
        line: '#DCE3F0',
        hairline: '#EEF1F5',
        pill: '#EEF3FF',
        surface: '#F6F8FC',
        active: '#EAF0FF',
        card: '#FBFCFE',
        checkbox: '#F1F5FF',
        divider: '#EEF1F6',
        status: {
          progress: orange,
          done: '#22B573',
          upcoming: '#98A2B3',
        },
        // Start of the mobile menu "Start Free" gradient; the end stop is indigo-600.
        vibrant: '#5B47FB',
        track: '#EEF2FF',
        star: '#F7B500',
        accent: {
          violet: '#8A5CFF',
          orange,
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(to right, #2F5BFF, #7B4DFF)',
        'hero-gradient': 'linear-gradient(to right, #F2F6FF, #F6F1FF)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        jakarta: [
          '"Plus Jakarta Sans"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        'testimonial-title': [
          '2.25rem',
          { lineHeight: '2.8125rem', fontWeight: '800' },
        ],
        'testimonial-title-sm': [
          '1.625rem',
          { lineHeight: '2.8125rem', fontWeight: '800' },
        ],
        quote: ['1.125rem', { lineHeight: '1.51875rem' }],
        'quote-sm': ['0.875rem', { lineHeight: '1.1875rem' }],
        'role-sm': ['0.625rem', { lineHeight: '0.9375rem' }],
        'quote-mark': ['3.375rem', { lineHeight: '3.375rem' }],
        'quote-mark-sm': ['2.75rem', { lineHeight: '2.75rem' }],
        'carousel-arrow': ['1.125rem', { lineHeight: '1.6875rem' }],
        'banner-title': [
          '1.875rem',
          { lineHeight: '2.34375rem', fontWeight: '800' },
        ],
        'tab-title': ['1rem', { lineHeight: '1.375rem' }],
        'stat-display': ['2.5rem', { lineHeight: '2.5rem', fontWeight: '800' }],
        logo: [
          '1.0625rem',
          { lineHeight: '1.59375rem', letterSpacing: '-0.025em' },
        ],
        nav: ['0.8125rem', { lineHeight: '1.21875rem' }],
        'section-title': [
          '2.125rem',
          {
            lineHeight: '3.1875rem',
            letterSpacing: '-0.025em',
            fontWeight: '800',
          },
        ],
        'section-title-sm': [
          '1.625rem',
          { lineHeight: '1.75rem', fontWeight: '800' },
        ],
        'section-lead': ['0.9375rem', { lineHeight: '1.40625rem' }],
        'card-title-sm': ['0.875rem', { lineHeight: '1.09375rem' }],
        'card-copy': ['0.8125rem', { lineHeight: '1.05625rem' }],
        'menu-item': ['1.05rem', { lineHeight: '1.625rem' }],
        'menu-cta': ['0.98125rem', { lineHeight: '1.5rem' }],
        'hero-title': [
          '3.625rem',
          {
            lineHeight: '3.915rem',
            letterSpacing: '-0.025em',
            fontWeight: '800',
          },
        ],
        'hero-title-sm': [
          '2.25rem',
          {
            lineHeight: '2.25rem',
            letterSpacing: '-0.025em',
            fontWeight: '800',
          },
        ],
        lead: ['1.125rem', { lineHeight: '1.828125rem' }],
        body: ['0.875rem', { lineHeight: '1.3125rem' }],
        small: ['0.75rem', { lineHeight: '1.125rem' }],
        caption: ['0.6875rem', { lineHeight: '1.03125rem' }],
        'badge-sm': ['0.625rem', { lineHeight: '0.625rem' }],
        'mock-title': ['1.25rem', { lineHeight: '1.5625rem' }],
        'stat-value': ['1.3125rem', { lineHeight: '1.640625rem' }],
        tiny: ['0.59375rem', { lineHeight: '0.890625rem' }],
        mini: ['0.53125rem', { lineHeight: '0.796875rem' }],
        nano: ['0.5rem', { lineHeight: '0.625rem' }],
      },
      spacing: {
        '1.625': '0.40625rem',
        '1.75': '0.4375rem',
        '4.0625': '1.015625rem',
        '9.5': '2.375rem',
        '8.5': '2.125rem',
        '4.75': '1.1875rem',
        '5.125': '1.28125rem',
        '6.375': '1.59375rem',
        '7.25': '1.8125rem',
        '13': '3.25rem',
        // Page gutters, used by `.container`.
        gutter: '1.25rem',
        'gutter-lg': '4rem',
        '4.5': '1.125rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '2.75': '0.6875rem',
        '8.25': '2.0625rem',
        '10.5': '2.625rem',
        '13.75': '3.4375rem',
        '19': '4.75rem',
        '20.5': '5.125rem',
        '27.5': '6.875rem',
        '37.5': '9.375rem',
        '50': '12.5rem',
        '42.5': '10.625rem',
        '107.5': '26.875rem',
        '150': '37.5rem',
        'hero-copy': '30.7rem',
      },
      maxWidth: {
        testimonial: '34.8125rem',
        bar: '26.25rem',
        'stat-card': '30.4375rem',
        'tab-card': '35rem',
        container: '90rem',
        mockup: '39.3rem',
      },
      borderRadius: {
        button: '0.625rem',
        panel: '0.875rem',
        card: '1.125rem',
      },
      boxShadow: {
        button: '0 1px 1px rgba(0, 0, 0, 0.05)',
        'menu-cta': '0 1px 1px #C7D2FE',
        testimonial: '0 10px 18px rgba(29, 42, 87, 0.1)',
        card: '0 10px 36px 0 rgba(29, 42, 87, 0.1)',
      },
    },
  },
  plugins: [],
} satisfies Config
