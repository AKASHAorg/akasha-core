import React, { forwardRef } from 'react';
import Stack from '../Stack';
import Icon from '../Icon';
import Text from '../Text';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import {
  getPasswordStrengthLabel,
  getPasswordStrengthLabelColor,
} from './getPasswordStrengthLabelProperties';
import { tw } from '@twind/core';

export enum PasswordStrengthLevel {
  VERY_WEAK = 0,
  WEAK = 1,
  FAIR = 2,
  GOOD = 3,
  STRONG = 4,
}

export interface PasswordFieldProps {
  strengthLevel?: PasswordStrengthLevel;
}

const PasswordField: React.FC<PasswordFieldProps & JSX.IntrinsicElements['input']> = forwardRef(
  ({ strengthLevel = 0, ...rest }, ref?: React.RefObject<HTMLInputElement>) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <Stack direction="column" spacing="gap-y-2">
        <Stack align="center" customStyle="relative">
          <input
            type={showPassword ? 'input' : 'password'}
            id="success"
            className={tw(
              'text-grey5 dark:text-grey6 placeholder-grey5 dark:placeholder-grey6 text-sm rounded-lg block w-full p-2.5 bg-grey9 border-0 focus:(outline-none ring-secondary-light border([1px] secondary-light)) dark:(bg-grey3 focus:(ring-secondary-dark border-secondary-dark) border([1px] secondary-dark))',
            )}
            placeholder="Enter your password"
            ref={ref}
            {...rest}
          />
          <div className={tw('absolute right-2')} onClick={() => setShowPassword(!showPassword)}>
            <Icon type={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} accentColor={true} />
          </div>
        </Stack>
        <PasswordStrengthIndicator strengthLevel={strengthLevel} />
        <Text variant="footnotes2" color={getPasswordStrengthLabelColor(strengthLevel)}>
          {getPasswordStrengthLabel(strengthLevel)}
        </Text>
      </Stack>
    );
  },
);

export default PasswordField;
