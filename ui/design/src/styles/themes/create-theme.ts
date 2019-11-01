import { DefaultTheme } from 'styled-components';
import colors from '../colors-light';
import shapes from '../shapes';
import createGrommetTheme from './index';

export function createTheme(overrides?: object): DefaultTheme {
  const styles = {
    colors,
    shapes,
    ...overrides,
  };
  return createGrommetTheme(styles);
}
