import { DefaultTheme } from 'styled-components';
import colors from '../colors-light';
import shapes from '../shapes';
import spacing from '../spacing';
import createGrommetTheme from '../theme';

export function createTheme(overrides?: object): DefaultTheme {
  const styles = {
    colors,
    spacing,
    shapes,
    ...overrides,
  };
  return createGrommetTheme(styles);
}
