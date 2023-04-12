import { Status } from '../../types/common.types';

export function getInputClasses(disabled: boolean, status: Status, readOnly?: boolean) {
  const defaultClasses = `peer focus:outline-none w-full bg-transparent py-[0.4375rem] text-[0.875rem] leading-[1.375rem] font-light`;
  if (disabled) {
    return `${defaultClasses} dark:text-grey2 text-grey7 dark:placeholder-grey2 placeholder-grey7`;
  }

  if (status) {
    return `${defaultClasses} dark:text-white text-grey5 dark:placeholder-white placeholder-grey5`;
  }

  if (readOnly) {
    return `${defaultClasses} text-grey7 placeholder-grey7`;
  }

  return `${defaultClasses} dark:text-grey6 text-grey5 dark:placeholder-grey6 placeholder-grey5`;
}
