export function getInputColor(isDisabled: boolean, error: boolean) {
  if (error) {
    return 'orange-400';
  }
  if (isDisabled) {
    return 'grey4';
  }
  return 'secondaryLight dark:secondaryDark';
}
