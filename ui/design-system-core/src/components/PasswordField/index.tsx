import React, { forwardRef } from 'react';
import { tw } from '@twind/core';

import Stack from '../Stack';
import Icon from '../Icon';
import { EyeIcon, EyeSlashIcon } from '../Icon/hero-icons-outline';
import Text from '../Text';
import PasswordStrengthIndicator, {
  PasswordStrengthIndicatorProps,
} from './PasswordStrengthIndicator';
import {
  getPasswordStrengthLabel,
  getPasswordStrengthLabelColor,
} from './getPasswordStrengthLabelProperties';

export type PasswordFieldProps = PasswordStrengthIndicatorProps & {
  placeholderLabel: string;
};

const PasswordField: React.FC<PasswordFieldProps & JSX.IntrinsicElements['input']> = forwardRef(
  ({ strengthLevel = 0, placeholderLabel, ...rest }, ref?: React.RefObject<HTMLInputElement>) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <Stack direction="column" spacing="gap-y-2">
        <Stack align="center" customStyle="relative">
          <input
            type={showPassword ? 'input' : 'password'}
            id="success"
            className={tw(
              'text-grey5 dark:text-grey6 placeholder-grey5 dark:placeholder-grey6 text-sm rounded-lg block w-full p-2.5 bg-grey9 border-0 focus:(outline-none ring-secondaryLight border([1px] secondaryLight)) dark:(bg-grey3 focus:(ring-secondaryDark border-secondaryDark) border([1px] secondaryDark))',
            )}
            placeholder={placeholderLabel}
            ref={ref}
            {...rest}
          />

          <button className={tw('absolute right-2')} onClick={() => setShowPassword(!showPassword)}>
            <Icon icon={showPassword ? <EyeSlashIcon /> : <EyeIcon />} accentColor={true} />
          </button>
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
