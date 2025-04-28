export function getCheckmarkColor(isDisabled: boolean, error: boolean) {
  if (error) {
    return 'after:border-white dark:after:border-black';
  }
  if (isDisabled) {
    return 'after:border-grey6 dark:after:border-grey5';
  }
  return 'after:border-white';
}
