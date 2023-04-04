import { Color, isStatusType, STATUS_TO_COLOR_CLASSES_MAP } from '../components/types/common.types';

export function getColorClasses(color: Color, utility?: string) {
  if (isStatusType(color)) {
    return getBaseColorClasses(STATUS_TO_COLOR_CLASSES_MAP[color], utility);
  }

  return getBaseColorClasses(color, utility);
}

function getBaseColorClasses(color: Color, utility?: string) {
  if (typeof color === 'string' && !color.trim().includes(' ')) {
    return utility ? `${utility}-${color}` : color;
  }

  if (typeof color === 'object') {
    const light = color.light;
    const dark = color.dark;

    if (!light.trim().includes(' ') && !dark.trim().includes(' '))
      return utility
        ? `${utility}-${color.light} dark:${utility}-${color.dark}`
        : `${color.light} dark:${color.dark}`;
  }
  return '';
}
