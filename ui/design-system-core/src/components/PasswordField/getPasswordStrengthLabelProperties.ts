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
      return { light: 'grey8', dark: 'grey5' };
    case PasswordStrengthLevel.WEAK:
      return { light: 'error-light', dark: 'error-dark' };
    case PasswordStrengthLevel.FAIR:
      return { light: 'warning-light', dark: 'warning-dark' };
    case PasswordStrengthLevel.GOOD:
      return { light: 'success', dark: 'success' };
    case PasswordStrengthLevel.STRONG:
      return { light: 'success', dark: 'success' };
  }
}
