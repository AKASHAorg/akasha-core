export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'linear-gradient(90deg, var(--foundation-primary))',
        primaryStart: 'var(--gradient-primary-start)',
        primaryStop: 'var(--gradient-primary-stop)',
        secondary: {
          light: 'var(--foundation-secondary)',
          dark: 'var(--foundation-secondary-dark)',
        },
        black: 'var(--system-black)',
        white: 'var(--system-white)',
        grey1: 'var(--system-grey-1)',
        grey2: 'var(--system-grey-2)',
        grey3: 'var(--system-grey-3)',
        grey4: 'var(--system-grey-4)',
        grey5: 'var(--system-grey-5)',
        grey6: 'var(--system-grey-6)',
        grey7: 'var(--system-grey-7)',
        grey8: 'var(--system-grey-8)',
        success: 'var(--feedback-success)',
        warning: {
          light: 'var(--feeback-warning)',
          dark: 'var(--feeback-warning-dark)',
        },
        error: {
          light: 'var(--feedback-error)',
          dark: 'var(--feedback-error-dark)',
        },
        elevation: 'var(--elevation)',
      },
      borderRadius: {
        large: '20px',
      },
    },
  },
};
