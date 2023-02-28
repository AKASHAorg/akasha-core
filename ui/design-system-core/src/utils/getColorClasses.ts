import { Color, isStatusType, Status } from '../components/types/common.types';

export function getColorClasses(color: Color) {
  if (isStatusType(color)) return STATUS_TO_TEXT_CLASSES_MAP[color];

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

const STATUS_TO_TEXT_CLASSES_MAP: Record<Status, string> = {
  error: 'text-error-light dark:text-error-dark',
  success: 'text-success',
  warning: 'text-warning-light dark:text-warning-dark',
};
