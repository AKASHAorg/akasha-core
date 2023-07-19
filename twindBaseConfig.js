function withOpacity(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

export default {
  darkMode: 'class',
  hash: false,
  theme: {
    extend: {
      fontFamily: {
        sans: 'Inter, sans-serif',
      },
      colors: {
        primary: 'linear-gradient(90deg, var(--foundation-primary))',
        primaryStart: withOpacity('--gradient-primary-start'),
        primaryStop: withOpacity('--gradient-primary-stop'),
        secondaryLight: withOpacity('--foundation-secondary'),
        secondaryDark: withOpacity('--foundation-secondary-dark'),
        black: withOpacity('--system-black'),
        white: withOpacity('--system-white'),
        grey1: withOpacity('--system-grey-1'),
        grey2: withOpacity('--system-grey-2'),
        grey3: withOpacity('--system-grey-3'),
        grey4: withOpacity('--system-grey-4'),
        grey5: withOpacity('--system-grey-5'),
        grey6: withOpacity('--system-grey-6'),
        grey7: withOpacity('--system-grey-7'),
        grey8: withOpacity('--system-grey-8'),
        grey9: withOpacity('--system-grey-9'),
        success: withOpacity('--feedback-success'),
        warningLight: withOpacity('--feedback-warning'),
        warningDark: withOpacity('--feedback-warning-dark'),
        errorLight: withOpacity('--feedback-error'),
        errorDark: withOpacity('--feedback-error-dark'),
        elevation: withOpacity('--elevation'),
      },
      borderRadius: {
        large: '20px',
      },
      scale: {
        flip: '-1',
      },
    },
  },
};
