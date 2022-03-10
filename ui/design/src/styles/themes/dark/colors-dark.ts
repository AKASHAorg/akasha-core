import { IColors } from '../interfaces';

export interface IColorsDark extends IColors {
  blue: string;
  darkBlue: string;
  grey: string;
  darkGrey: string;
  mediumGrey: string;
  lightGrey: string;
  deepGrey: string;
  deeperGrey: string;
  cadetGrey: string;
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
  darkGrey: '#000C20',
  mediumGrey: '#B6BFD1',
  lightGrey: '#EDF0F5',
  deepGrey: '#7F7F7F',
  deeperGrey: '#87909E',
  cadetGrey: '#595F6B',
  disabled: '#9ea0a5',
  lightBeige: '#F8F4F4',
  white: '#FBFCFD', // lotion white
  red: '#FF5050',
  green: '#36B37E',
  // define use cases for colors
  primaryText: '#FBFCFD', // lotion white
  secondaryText: '#B6BFD1', // grey
  textBackground: '#425166',
  disabledText: '#9ea0a5', // disabled
  subtitleText: '#595F6B', // cadetGrey
  errorText: '#FF5050', // red
  darkText: '#47484A', // system/off white/dark
  inputText: '#47484A', // system/off white/dark
  background: '#0D1A2D', // dark blue
  beigeBackground: '#F8F4F4', // lightBeige
  ultraLightBackground: '#E7E9EC', // ultralightGrey
  lightBackground: '#132540', // dark blue
  darkBackground: '#0D1A2D',
  cardBackground: '#132540',
  modalBackground: '#132540', // deepGrey
  modalBackgroundAlt: '#87909E', // deeperGrey
  modalBackgroundTransparent: 'rgba(0, 0, 0, 0.6)', // transparentBlack
  activeCardBackground: '#F6F8FF', // aquamarine
  inputBackground: '#CCD2DF',
  hoverBackground: '#595F6B',
  coverImageBackground: '#425166',
  embedBackground: '#253142',
  btnAccentColor: '#FBFCFD', // lotion
  accent: '#4E71FF', // blue
  accentOpacity: 'rgba(78, 113, 255, 0.1)', // blue with 0.1 opacity
  accentLight: '#E9EDFD', // lightBlue
  border: '#425166', // lightGrey
  lightBorder: '#425166', // lighterGrey
  darkBorder: '#B6BFD1', // deepGrey
  darkerBorder: '#87909E', // deeperGrey
  secondary: '#000C20', // darkGrey
  secondaryOpacity: 'rgba(0, 12, 32, 0.5)', // darkgrey with 0.5 opacity
  elevationLow: '0px 0px 1px rgba(40, 41, 61, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.32)',
  elevationMedium: '0px 0px 1px rgba(0, 0, 0, 0.04), 0px 2px 4px rgba(0, 0, 0, 0.32)',
  elevationHigh: '0px 0px 2px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.32)',
};
export default colors;
