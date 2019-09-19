import colors from '../colors-dark';
import { createTheme } from './create-theme';

export default createTheme({
  colors: { ...colors },
  name: 'Dark-Theme',
  dark: true,
});
