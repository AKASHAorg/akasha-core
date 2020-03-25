import { DefaultTheme } from 'styled-components';
import breakpoints from '../../responsive-breakpoints';
import shapes from '../../shapes';
import colors from '../light/colors-light';
import createGrommetTheme from './create-grommet-theme';

// defaults to 'light theme' if no override is passed
export function createTheme(overrides?: object): DefaultTheme {
  const styles = {
    colors,
    shapes,
    breakpoints: breakpoints.global.breakpoints,
    ...overrides,
  };
  return createGrommetTheme(styles);
}
