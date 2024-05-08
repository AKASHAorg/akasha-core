export function getBgColor(isDisabled: boolean, isSelected: boolean, error: boolean) {
  if (isDisabled) {
    return 'before:bg-grey4';
  }
  if (!isSelected) {
    return 'before:bg-transparent before:disabled:opacity-75 disabled:before:bg-grey4';
  }
  if (error) {
    return 'before:bg-errorDark';
  } else {
    return 'before:bg-secondaryLight dark:before:bg-secondaryDark';
  }
}
