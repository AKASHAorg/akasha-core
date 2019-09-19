import { DefaultTheme } from 'styled-components';
import createGrommetTheme from '../theme';
import colors from '../colors-light';
import shapes from '../shapes';
import spacing from '../spacing';

export function createTheme(overrides?: object): DefaultTheme {
  const styles = {
    colors,
    spacing,
    shapes,
    ...overrides,
  };
  return createGrommetTheme(styles);
}
