import { DefaultTheme } from 'styled-components';
import colors from '../colors-light';
import breakpoints from '../responsive-breakpoints';
import shapes from '../shapes';
import createGrommetTheme from './index';

export function createTheme(overrides?: object): DefaultTheme {
  const styles = {
    colors,
    shapes,
    breakpoints: breakpoints.global.breakpoints,
    ...overrides,
  };
  return createGrommetTheme(styles);
}
