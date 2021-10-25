import { DefaultTheme } from '../interfaces';
import breakpoints from '../../responsive-breakpoints';
import shapes from '../../shapes';
import colors from '../light/colors-light';
import createGrommetTheme from './create-grommet-theme';

// defaults to 'light theme' if no override is passed
export function createTheme(overrides?: Record<string, unknown>): DefaultTheme {
  const styles = {
    colors,
    shapes,
    breakpoints: breakpoints.global.breakpoints,
    ...overrides,
  };

  return createGrommetTheme(styles);
}
