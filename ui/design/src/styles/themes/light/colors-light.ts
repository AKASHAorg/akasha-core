import { IColors } from '../interfaces';

export interface IColorsLight extends IColors {
  darkGrey: string;
  grey: string;
  mediumGrey: string;
  lightGrey: string;
  lightestGrey: string;
  ultraLightGrey: string;
  deepGrey: string;
  deeperGrey: string;
  cadetGrey: string;
  lightBeige: string;
  white: string;
  red: string;
  green: string;
  disabled: string;
}

const colors: IColorsLight = {
  blue: '#4E71FF',
  lightBlue: '#D3DAFA',
  darkerBlue: '#132540',
  darkBlue: '#425166',
  darkGrey: '#000C20',
  grey: '#949EB3',
  mediumGrey: '#B6BFD1',
  lightGrey: '#EDF0F5',
  lightestGrey: '#F5F7F9',
  ultraLightGrey: '#FBFCFD',
  deepGrey: '#7F7F7F',
  deeperGrey: '#87909E',
  cadetGrey: '#595F6B',
  lightBeige: '#F8F4F4',
  white: '#FBFCFD', // lotion white
  red: '#FF4040',
  green: '#36B37E',
  ultraMarine: '#4e71ff',
  lightUltraMarine: '#8b9FFF',
  // define use cases for colors
  disabled: '#9ea0a5',
  primaryText: '#132540', // darkerBlue
  secondaryText: '#425166', // darkBlue
  textBackground: '#E9EDFD', // light blue
  disabledText: '#9ea0a5', // disabled
  titleText: '#47484A',
  subtitleText: '#595F6B', // cadetGrey
  errorText: '#FF4040', // red
  darkText: '#132540',
  accentText: '#4666E6', // blue
  inputText: '#425166', // darkBlue
  background: '#FFFFFF', // white
  altRed: '#FF5050',
  altGreen: '#36B37E',
  overlay: 'rgba(0, 0, 0, 0.6)', // black, 60% opacity
  ultraLightBackground: '#FBFCFD', // ultralightGrey
  beigeBackground: '#F8F4F4', // lightBeige
  lightBackground: '#EDF0F5', // lightGrey
  darkBackground: '#000C20',
  cardBackground: '#FFF',
  modalBackground: '#7F7F7F', // deepGrey
  modalBackgroundAlt: '#87909E', // deeperGrey
  modalBackgroundTransparent: 'rgba(0, 0, 0, 0.6)', // transparentBlack
  activeCardBackground: '#F6F8FF', // aquamarine
  hoverBackground: '#F1F4FF',
  activePanelBackground: '#DCE3FF',
  skeletonBackground: '#EDF0F5',
  inputBackground: '#FFF',
  coverImageBackground: '#ECF1FE',
  embedBackground: '#FBFCFD',
  btnAccentColor: '#4E71FF', // blue
  accent: '#4E71FF', // blue
  accentOpacity: 'rgba(78, 113, 255, 0.1)', // blue with 0.1 opacity
  accentLight: '#E9EDFD', // lightBlue
  accentLightHover: '#D3DAFA', //light blue
  border: '#EDF0F5', // lightGrey
  lightBorder: '#F5F6F7', // lighterGrey
  darkBorder: '#B6BFD1', // deepGrey
  darkerBorder: '#87909E', // deeperGrey
  secondary: '#000C20', // darkgrey
  secondaryOpacity: 'rgba(0, 12, 32, 0.5)', // darkgrey with 0.5 opacity
  elevationLow: '0px 4px 16px rgba(83, 98, 124, 0.06)',
  elevationMedium: '0px 4px 10px rgba(19, 37, 64, 0.1)',
  elevationHigh: '0px 3px 14px rgba(83, 99, 124, 0.16)',
};

export default colors;
