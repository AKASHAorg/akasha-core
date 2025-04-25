export function getInputColor(isDisabled: boolean, error: boolean) {
  if (error) {
    return 'before:border-orange-400';
  }
  if (isDisabled) {
    return 'before:border-grey4';
  }
  return 'before:border-secondaryLight dark:before:border-secondaryDark';
}
