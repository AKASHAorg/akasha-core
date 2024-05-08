export function getTextColor(isDisabled: boolean, error: boolean, labelColor: string) {
  if (error) {
    return 'text-errorLight dark:text-errorDark hover:text-errorLight';
  }
  if (isDisabled) {
    return 'text-grey4 hover:text-grey4';
  }
  return labelColor;
}
