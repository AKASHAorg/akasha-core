export interface IBreakpoint {
  value: number;
}

export interface IBreakpoints {
  small: IBreakpoint;
  medium: IBreakpoint;
  large: IBreakpoint;
  xlarge: IBreakpoint;
}
export interface IResponsiveBreakpoints {
  global: {
    breakpoints: IBreakpoints;
  };
}

export default {
  global: {
    breakpoints: {
      small: {
        value: 550,
      },
      medium: {
        value: 768,
      },
      large: {
        value: 992,
      },
      xlarge: {
        value: 1200,
      },
    },
  },
};
