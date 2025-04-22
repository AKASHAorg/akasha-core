import { Status } from '../../types/common.types';

const STATUS_TO_BORDER_CLASSES_MAP: Record<Status, string> = {
  success: 'border border-success',
  error: 'border border-errorLight dark:border-errorDark',
  warning: 'border border-warningLight dark:border-warningDark',
};

export function getContainerClasses(
  disabled: boolean,
  status: Status,
  readOnly?: boolean,
  altBg?: boolean,
) {
  const defaultBgColors = `bg-white dark:bg-grey3`;
  const altBgColors = `bg-grey9 dark:bg-grey3`;
  const style = `rounded-[0.5rem] ${altBg ? altBgColors : defaultBgColors} border border-grey6 dark:border-none`;

  if (!disabled && !readOnly && !status) {
    return `${style} focus-within:border focus-within:border-secondaryLight dark:focus-within:border-secondaryDark`;
  }

  if (disabled || readOnly) {
    return `${style} bg-grey8 dark:bg-grey5 border-none`;
  }

  if (status) {
    return `${style} ${STATUS_TO_BORDER_CLASSES_MAP[status]}`;
  }
}
