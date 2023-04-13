import React from 'react';
import Stack from '../Stack';
import { tx } from '@twind/core';
import { PasswordFieldProps } from './index';
import { getBarColor } from './getBarColor';

const PasswordStrengthIndicator: React.FC<PasswordFieldProps> = ({ strengthLevel }) => {
  return (
    <Stack align="center" fullWidth={true} customStyle="grid grid-cols-4 gap-2">
      {Array.from({ length: 4 }, (_, idx) => (
        <div key={idx} className={tx(`h-1 w-full ${getBarColor(idx, strengthLevel)}`)} />
      ))}
    </Stack>
  );
};
export default PasswordStrengthIndicator;
