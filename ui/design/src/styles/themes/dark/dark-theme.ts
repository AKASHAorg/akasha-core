import { createTheme } from '../utils/create-theme';
import colors from './colors-dark';

export default createTheme({
  colors: { ...colors },
  dark: true,
});
