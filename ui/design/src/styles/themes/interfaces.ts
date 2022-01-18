import { ThemeType } from 'grommet';
import { IBreakpoints } from '../responsive-breakpoints';
import { IShapes } from '../shapes';

export interface DefaultTheme extends ThemeType {
  colors: IColors;
  shapes: IShapes;
  breakpoints: IBreakpoints;
  name?: string;
}

export interface IColors {
  white: string;
  primaryText: string;
  secondaryText: string;
  errorText: string;
  background: string;
  ultraLightBackground: string;
  lightBackground: string;
  darkBackground: string;
  modalBackground: string;
  modalBackgroundAlt: string;
  modalBackgroundTransparent: string;
  accent: string;
  accentOpacity: string;
  accentLight: string;
  border: string;
  darkBorder: string;
  darkerBorder: string;
  secondary: string;
  secondaryOpacity: string;
  shadow: string;
  disabledText: string;
  activeCardBackground: string;
}
