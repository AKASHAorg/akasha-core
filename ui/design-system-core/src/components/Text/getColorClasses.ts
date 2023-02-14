import { Color } from './index';

export function getColorClasses(color: Color) {
  if (typeof color === 'string' && color.startsWith('text-') && !color.trim().includes(' ')) {
    return color;
  }

  if (typeof color === 'object') {
    const light = color.light;
    const dark = color.dark;

    if (
      light.startsWith('text-') &&
      !light.trim().includes(' ') &&
      dark.startsWith('text-') &&
      !dark.trim().includes(' ')
    )
      return `${color.light} dark:${color.dark}`;
  }

  return 'invalid';
}
