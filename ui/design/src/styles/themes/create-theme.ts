import colors from '../colors-light';
import shapes from '../shapes';
import createGrommetTheme from './index';

export function createTheme(overrides?: object): any {
  const styles = {
    colors,
    shapes,
    ...overrides,
  };
  return createGrommetTheme(styles);
}
