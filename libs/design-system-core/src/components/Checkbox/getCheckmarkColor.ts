export function getCheckmarkColor(isDisabled: boolean, error: boolean) {
  if (error) {
    return 'white dark:black';
  }
  if (isDisabled) {
    return 'grey6 dark:grey5';
  }
  return 'white';
}
