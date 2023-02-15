import { getColorClasses } from '../../../utils/getColorClasses';
import { Status, STATUS_TO_COLOR_MAP } from '../../types/common.types';

export function getIconClasses(status: Status) {
  const defaultClasses = `h-5`;

  if (status) {
    return `${defaultClasses} ${getColorClasses(STATUS_TO_COLOR_MAP[status])}`;
  }

  return defaultClasses;
}
