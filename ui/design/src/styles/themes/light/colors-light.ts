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
  // define use cases for colors
  primaryText: '#132540', // darkBlue
  secondaryText: '#949EB3', // grey
  errorText: '#FF4040', // red
  background: '#FFF', // white
  ultraLightBackground: '#FBFCFD', // ultralightGrey
  lightBackground: '#EDF0F5', // lightGrey
  darkBackground: '#000C20',
  modalBackground: '#7F7F7F', // deepGrey
  accent: '#4E71FF', // blue
  border: '#EDF0F5', // lightGrey
  secondary: '#000C20', // darkgrey
  secondaryOpacity: 'rgba(0, 12, 32, 0.5)', // darkgrey with 0.5 opacity
  shadow: '0 8px 24px 0 rgba(83,98,124,0.06)',
};

export default colors;
