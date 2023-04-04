import { Status } from '../../types/common.types';

const STATUS_TO_BORDER_CLASSES_MAP: Record<Status, string> = {
  error: 'border border-error-light dark:border-error-dark',
  success: 'border border-success',
  warning: 'border border-warning-light dark:border-warning-dark',
};

export function getContainerClasses(disabled: boolean, status: Status, readOnly?: boolean) {
  const defaultStyle = `px-2.5 rounded-lg bg-grey9 dark:bg-grey3`;

  if (!disabled && !status && !readOnly) {
    return `${defaultStyle} focus-within:border focus-within:border-secondary-light dark:focus-within:border-secondary-dark`;
  }

  if (disabled) {
    return `${defaultStyle} bg-grey9 dark:bg-grey4`;
  }

  if (readOnly) {
    return `${defaultStyle} bg-grey8 dark:bg-grey4`;
  }

  if (status) {
    return `${defaultStyle} ${STATUS_TO_BORDER_CLASSES_MAP[status]}`;
  }
}
