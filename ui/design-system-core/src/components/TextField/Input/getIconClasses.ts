import { Color, STATUS_TO_COLOR_CLASSES_MAP, Status } from '../../types/common.types';

export function getIconClasses(disabled: boolean, status: Status): Color {
  if (disabled) {
    return { light: 'grey2', dark: 'grey7' };
  }

  if (status) {
    return STATUS_TO_COLOR_CLASSES_MAP[status];
  }
}
