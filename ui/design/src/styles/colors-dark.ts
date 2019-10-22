import { IColors } from './colors-light';

interface IColorsDark extends IColors {
  blue: string;
  darkBlue: string;
  grey: string;
  mediumGrey: string;
  lightGrey: string;
  white: string;
}

const colors: IColorsDark = {
  blue: '#4E71FF',
  darkBlue: '#132540',
  grey: '#949EB3',
  mediumGrey: '#B6BFD1',
  lightGrey: '#EDF0F5',
  white: '#FFF',
  // define use cases for colors
  primaryText: '#132540', // darkBlue
  secondaryText: '#949EB3', // grey
  lightBackground: '#EDF0F5', // lightGrey
  darkBackground: '#000C20',
  accent: '#4E71FF', // blue
  border: '#EDF0F5', // lightGrey
  secondary: '#000C20', // darkGrey
  secondaryOpacity: 'rgba(0, 12, 32, 0.5)', // darkgrey with 0.5 opacity
};
export default colors;
