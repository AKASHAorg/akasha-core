import { IColors } from '../interfaces';

export interface IColorsDark extends IColors {
  blue: string;
  darkBlue: string;
  grey: string;
  mediumGrey: string;
  lightGrey: string;
  deepGrey: string;
  deeperGrey: string;
  lightBeige: string;
  white: string;
  red: string;
  green: string;
  disabled: string;
}

const colors: IColorsDark = {
  blue: '#4E71FF',
  darkBlue: '#0046CB',
  grey: '#949EB3',
  mediumGrey: '#B6BFD1',
  lightGrey: '#EDF0F5',
  deepGrey: '#7F7F7F',
  deeperGrey: '#87909E',
  disabled: '#9ea0a5',
  lightBeige: '#F8F4F4',
  white: '#FBFCFD', // lotion white
  red: '#FF5050',
  green: '#36B37E',
  // define use cases for colors
  primaryText: '#FBFCFD', // lotion white
  secondaryText: '#B6BFD1', // grey
  disabledText: '#9ea0a5', // disabled
  errorText: '#FF5050', // red
  darkText: '#47484A', // system/off white/dark
  background: '#0D1A2D', // white
  beigeBackground: '#F8F4F4', // lightBeige
  ultraLightBackground: '#E7E9EC', // ultralightGrey
  lightBackground: '#B8BEC6', // lightGrey
  darkBackground: '#0D1A2D',
  cardBackground: '#132540',
  modalBackground: '#132540', // deepGrey
  modalBackgroundAlt: '#87909E', // deeperGrey
  modalBackgroundTransparent: 'rgba(0, 0, 0, 0.6)', // transparentBlack
  activeCardBackground: '#F6F8FF', // aquamarine
  inputBackground: '#CCD2DF',
  hoverBackground: '#595F6B',
  btnAccentColor: '#FBFCFD', // lotion
  accent: '#4E71FF', // blue
  accentOpacity: 'rgba(78, 113, 255, 0.1)', // blue with 0.1 opacity
  accentLight: '#E9EDFD', // lightBlue
  border: 'rgba(255, 255, 255, 0.2)', // lightGrey
  lightBorder: '#F5F6F7', // lighterGrey
  darkBorder: '#B6BFD1', // deepGrey
  darkerBorder: '#87909E', // deeperGrey
  secondary: '#000C20', // darkGrey
  secondaryOpacity: 'rgba(0, 12, 32, 0.5)', // darkgrey with 0.5 opacity
  shadow: '0 8px 24px 0 rgba(83, 98, 124, 0.06)',
};
export default colors;
