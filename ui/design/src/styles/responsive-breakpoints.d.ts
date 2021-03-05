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
declare const _default: {
  global: {
    breakpoints: {
      small: {
        value: number;
      };
      medium: {
        value: number;
      };
      large: {
        value: number;
      };
      xlarge: {
        value: number;
      };
    };
  };
};
export default _default;
