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
        value: 1024,
      },
      large: {
        value: 1224,
      },
      xlarge: {
        value: 1920,
      },
    },
  },
};
