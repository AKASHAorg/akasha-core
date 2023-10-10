export function getTextColor(isDisabled: boolean, error: boolean) {
  if (error) {
    return 'text-errorLight dark:text-errorDark hover:text-errorLight';
  }
  if (isDisabled) {
    return 'text-grey4 hover:text-grey4';
  }
  return 'text(black dark:white) hover:text-secondaryLight dark:hover:text-secondaryDark';
}
