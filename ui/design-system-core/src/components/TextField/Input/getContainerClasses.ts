import { Status } from '../../types/common.types';

const STATUS_TO_BORDER_CLASSES_MAP: Record<Status, string> = {
  error: 'border border-errorLight dark:border-errorDark',
  success: 'border border-success',
  warning: 'border border-warningLight dark:border-warningDark',
};

export function getContainerClasses(
  disabled: boolean,
  status: Status,
  readOnly?: boolean,
  altBg?: boolean,
) {
  const defaultBgColors = `grey9 dark:grey3`;
  const altBgColors = `white dark:grey5`;
  const style = `px-2.5 rounded-lg bg(${altBg ? altBgColors : defaultBgColors}) border(${
    altBg ? altBgColors : defaultBgColors
  })`;

  if (!disabled && !status && !readOnly) {
    return `${style} focus-within:border focus-within:border-secondaryLight dark:focus-within:border-secondaryDark`;
  }

  if (disabled) {
    return `${style} bg-grey9 dark:bg-grey4`;
  }

  if (readOnly) {
    return `${style} bg-grey8 dark:bg-grey4`;
  }

  if (status) {
    return `${style} ${STATUS_TO_BORDER_CLASSES_MAP[status]}`;
  }
}
