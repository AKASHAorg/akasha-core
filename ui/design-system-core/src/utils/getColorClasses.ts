import { apply } from '@twind/core';
import { Color, isStatusType, Status } from '../components/types/common.types';

export function getColorClasses(color: Color, utility?: string) {
  if (isStatusType(color)) return STATUS_TO_TEXT_CLASSES_MAP[color];

  if (typeof color === 'string' && !color.trim().includes(' ')) {
    return utility ? `${utility}-${color}` : color;
  }

  if (typeof color === 'object') {
    const light = color.light;
    const dark = color.dark;

    if (!light.trim().includes(' ') && !dark.trim().includes(' '))
      return utility
        ? apply`${utility}-${color.light} dark:${utility}-${color.dark}`
        : apply`${color.light} dark:${color.dark}`;
  }

  return '';
}

const STATUS_TO_TEXT_CLASSES_MAP: Record<Status, string> = {
  error: 'text-error-light dark:text-error-dark',
  success: 'text-success',
  warning: 'text-warning-light dark:text-warning-dark',
};
