import React from 'react';
import { tx } from '@twind/core';

import Stack from '../Stack';

import { getBarColor } from './getBarColor';

export enum PasswordStrengthLevel {
  VERY_WEAK = 0,
  WEAK = 1,
  FAIR = 2,
  GOOD = 3,
  STRONG = 4,
}

export type PasswordStrengthIndicatorProps = {
  strengthLevel?: PasswordStrengthLevel;
};
const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ strengthLevel }) => {
  return (
    <Stack align="center" fullWidth={true} customStyle="grid grid-cols-4 gap-2">
      {Array.from({ length: 4 }, (_, idx) => (
        <div key={idx} className={tx(`h-1 w-full ${getBarColor(idx, strengthLevel)}`)} />
      ))}
    </Stack>
  );
};
export default PasswordStrengthIndicator;
