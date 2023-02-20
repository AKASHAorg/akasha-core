import { Status } from '../../types/common.types';

const STATUS_TO_ICON_CLASSES_MAP: Record<Status, string> = {
  error: 'stroke-error-light dark:stroke-error-dark',
  success: 'stroke-success',
  warning: 'stroke-warning-light dark:stroke-warning-dark',
};

export function getIconClasses(disabled: boolean, status: Status) {
  const defaultClasses = 'h-5';

  if (!disabled && !status) {
    return `${defaultClasses} dark:stroke-white stroke-grey2 peer-focus:stroke-secondary-light peer-focus:dark:stroke-secondary-dark`;
  }

  if (disabled) {
    return `${defaultClasses} dark:stroke-grey2 stroke-grey7`;
  }

  if (status) {
    return `${defaultClasses}  ${STATUS_TO_ICON_CLASSES_MAP[status]}`;
  }
}
