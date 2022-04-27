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
  blue: string;
  lightBlue: string;
  darkerBlue: string;
  darkBlue: string;
  white: string;
  ultraMarine: string;
  lightUltraMarine: string;
  primaryText: string;
  secondaryText: string;
  errorText: string;
  darkText: string;
  inputText: string;
  background: string;
  overlay: string;
  beigeBackground: string;
  ultraLightBackground: string;
  lightBackground: string;
  darkBackground: string;
  cardBackground: string;
  modalBackground: string;
  modalBackgroundAlt: string;
  modalBackgroundTransparent: string;
  hoverBackground: string;
  activePanelBackground: string;
  skeletonBackground: string;
  inputBackground: string;
  coverImageBackground: string;
  embedBackground: string;
  textBackground: string;
  btnAccentColor: string;
  accent: string;
  accentOpacity: string;
  accentLight: string;
  accentLightHover: string;
  border: string;
  lightBorder: string;
  darkBorder: string;
  darkerBorder: string;
  secondary: string;
  secondaryOpacity: string;
  elevationLow: string;
  elevationMedium: string;
  elevationHigh: string;
  disabledText: string;
  titleText: string;
  subtitleText: string;
  activeCardBackground: string;
}
