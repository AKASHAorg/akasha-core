import { Color } from '../types/common.types';

import { PasswordStrengthLevel } from './PasswordStrengthIndicator';

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
      return { light: 'grey4', dark: 'grey6' } as Color;
    case PasswordStrengthLevel.WEAK:
      return { light: 'errorLight', dark: 'errorDark' } as Color;
    case PasswordStrengthLevel.FAIR:
      return { light: 'warningLight', dark: 'warningDark' } as Color;
    case PasswordStrengthLevel.GOOD || PasswordStrengthLevel.STRONG:
      return 'success' as Color;
  }
}
