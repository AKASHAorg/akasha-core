import { Color, isStatusType, STATUS_TO_COLOR_CLASSES_MAP } from '../components/types/common.types';

export function getColorClasses(color: Color, directive: string) {
  if (isStatusType(color)) {
    return getBaseColorClasses(STATUS_TO_COLOR_CLASSES_MAP[color], directive);
  }

  return getBaseColorClasses(color, directive);
}

function getBaseColorClasses(color: Color, directive?: string) {
  if (typeof color === 'string' && isValidColor(color)) {
    return directive ? `${directive}-${color}` : color;
  }

  if (typeof color === 'object') {
    const light = color.light;
    const dark = color.dark;

    return directive ? `${directive}-${light} dark:${directive}-${dark}` : `${light} dark:${dark}`;
  }
  return '';
}

function isValidColor(color: string) {
  if (color.trim().includes(' ')) {
    throw new Error('Invalid color!');
  }

  return true;
}
