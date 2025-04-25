import { Status } from '../../types/common.types';

export function getInputClasses(disabled: boolean, status: Status, readOnly?: boolean) {
  const defaultClasses = `peer focus:outline-none w-full bg-transparent text-[0.875rem] leading-[1.375rem] font-light`;
  if (disabled) {
    return `${defaultClasses} text-grey7 dark:text-grey2 placeholder-grey7 dark:placeholder-grey2`;
  }

  if (status) {
    return `${defaultClasses} text-grey5 dark:text-white placeholder-grey5 dark:placeholder-white`;
  }

  if (readOnly) {
    return `${defaultClasses} text-grey7 placeholder-grey7`;
  }

  return `${defaultClasses} text-grey5 dark:text-grey6 placeholder-grey5 dark:placeholder-grey6`;
}
