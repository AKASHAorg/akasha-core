import { IColors } from '../interfaces';

export interface IColorsLight extends IColors {
  blue: string;
  darkBlue: string;
  darkGrey: string;
  grey: string;
  mediumGrey: string;
  lightGrey: string;
  lightestGrey: string;
  ultraLightGrey: string;
  deepGrey: string;
  white: string;
  red: string;
  green: string;
  disabled: string;
}

const colors: IColorsLight = {
  blue: '#4E71FF',
  darkBlue: '#132540',
  darkGrey: '#000C20',
  grey: '#949EB3',
  mediumGrey: '#B6BFD1',
  lightGrey: '#EDF0F5',
  lightestGrey: '#F5F7F9',
  ultraLightGrey: '#FBFCFD',
  deepGrey: '#7F7F7F',
  white: '#FFF',
  red: '#FF4040',
  green: '#36B37E',
  disabled: '#9ea0a5',
  // define use cases for colors
  primaryText: '#132540', // darkBlue
  secondaryText: '#949EB3', // grey
  disabledText: '#9ea0a5', // disabled
  errorText: '#FF4040', // red
  background: '#FFF', // white
  ultraLightBackground: '#FBFCFD', // ultralightGrey
  lightBackground: '#EDF0F5', // lightGrey
  darkBackground: '#000C20',
  modalBackground: '#7F7F7F', // deepGrey
  modalBackgroundAlt: '#87909E', // deeperGrey
  modalBackgroundTransparent: 'rgba(97, 120, 158, 0.45)', // transparentGrey
  accent: '#4E71FF', // blue
  accentOpacity: 'rgba(78, 113, 255, 0.1)', // blue with 0.1 opacity
  accentLight: '#E9EDFD', // lightBlue
  border: '#EDF0F5', // lightGrey
  secondary: '#000C20', // darkgrey
  secondaryOpacity: 'rgba(0, 12, 32, 0.5)', // darkgrey with 0.5 opacity
  shadow: '0 8px 24px 0 rgba(83,98,124,0.06)',
};

export default colors;
