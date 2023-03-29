import { PasswordStrengthLevel } from './index';

export function getPasswordStrengthLabel(strengthLevel: PasswordStrengthLevel) {
  switch (strengthLevel) {
    case PasswordStrengthLevel.VERY_WEAK:
      return 'Very Weak';
    case PasswordStrengthLevel.WEAK:
      return 'Weak';
    case PasswordStrengthLevel.FAIR:
      return 'Fair';
    case PasswordStrengthLevel.GOOD:
      return 'Good';
    case PasswordStrengthLevel.STRONG:
      return 'Strong';
  }
}

export function getPasswordStrengthLabelColor(strengthLevel: PasswordStrengthLevel) {
  switch (strengthLevel) {
    case PasswordStrengthLevel.VERY_WEAK:
      return { light: 'text-grey4', dark: 'text-grey6' };
    case PasswordStrengthLevel.WEAK:
      return { light: 'text-error-light', dark: 'text-error-dark' };
    case PasswordStrengthLevel.FAIR:
      return { light: 'text-warning-light', dark: 'text-warning-dark' };
    case PasswordStrengthLevel.GOOD:
      return { light: 'text-success', dark: 'text-success' };
    case PasswordStrengthLevel.STRONG:
      return { light: 'text-success', dark: 'text-success' };
  }
}
