import { PasswordStrengthLevel } from './index';

export function getBarColor(idx: number, strengthLevel: PasswordStrengthLevel) {
  const defaultClasses = 'bg-grey8 dark:bg-grey5';
  if (strengthLevel === PasswordStrengthLevel.VERY_WEAK) {
    return `${defaultClasses} `;
  }
  if (strengthLevel === PasswordStrengthLevel.WEAK && idx + 1 <= strengthLevel) {
    return `bg-errorLight dark:bg-errorDark`;
  }
  if (strengthLevel === PasswordStrengthLevel.FAIR && idx + 1 <= strengthLevel) {
    return `bg-warningLight dark:bg-warningDark`;
  }
  if (strengthLevel === PasswordStrengthLevel.GOOD && idx + 1 <= strengthLevel) {
    return `bg-success dark:bg-success`;
  }
  if (strengthLevel === PasswordStrengthLevel.STRONG && idx + 1 <= strengthLevel) {
    return `bg-success dark:bg-success`;
  }

  return `${defaultClasses} `;
}
