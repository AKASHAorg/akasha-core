import { PasswordStrengthLevel } from './index';

export function getBarColor(idx: number, strengthLevel: PasswordStrengthLevel) {
  const defaultClasses = 'bg-grey8 dark:bg-grey5';
  if (strengthLevel === PasswordStrengthLevel.VERY_WEAK) {
    return `${defaultClasses} `;
  }
  if (strengthLevel === PasswordStrengthLevel.WEAK && idx + 1 <= strengthLevel) {
    return `bg-error-light dark:bg-error-dark`;
  }
  if (strengthLevel === PasswordStrengthLevel.FAIR && idx + 1 <= strengthLevel) {
    return `bg-warning-light dark:bg-warning-dark`;
  }
  if (strengthLevel === PasswordStrengthLevel.GOOD && idx + 1 <= strengthLevel) {
    return `bg-success dark:bg-success`;
  }
  if (strengthLevel === PasswordStrengthLevel.STRONG && idx + 1 <= strengthLevel) {
    return `bg-success dark:bg-success`;
  }

  return `${defaultClasses} `;
}
