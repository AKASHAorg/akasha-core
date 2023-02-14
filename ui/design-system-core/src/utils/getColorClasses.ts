import { Color } from '../components/types/common.types';

export function getColorClasses(color: Color) {
  if (typeof color === 'string' && !color.trim().includes(' ')) {
    return color;
  }

  if (typeof color === 'object') {
    const light = color.light;
    const dark = color.dark;

    if (!light.trim().includes(' ') && !dark.trim().includes(' '))
      return `${color.light} dark:${color.dark}`;
  }

  return '';
}
