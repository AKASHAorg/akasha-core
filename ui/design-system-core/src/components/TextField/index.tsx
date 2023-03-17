import React, { forwardRef } from 'react';
import Caption from './Caption';
import Label from './Label';
import Stack from '../Stack';

import { Input } from './Input';
import { TextFieldProps } from './types';

const TextField: React.FC<TextFieldProps> = forwardRef(
  (props, ref?: React.RefObject<HTMLInputElement>) => {
    const { label, status, caption, disabled } = props;

    return (
      <Stack direction="column" spacing="gap-y-2">
        {label && <Label disabled={disabled}>{label}</Label>}
        <Input {...props} ref={ref} />
        {caption && (
          <Caption status={status} disabled={disabled}>
            {caption}
          </Caption>
        )}
      </Stack>
    );
  },
);

export default TextField;
