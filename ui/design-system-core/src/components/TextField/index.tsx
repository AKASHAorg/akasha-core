import React, { forwardRef } from 'react';
import Caption from './Caption';
import Label from './Label';
import { apply, tw } from '@twind/core';
import { Input } from './Input';
import { TextFieldProps } from './types';

const TextField: React.FC<TextFieldProps> = forwardRef(
  (props, ref?: React.RefObject<HTMLInputElement>) => {
    const { label, status, caption, disabled } = props;

    return (
      <div className={tw(apply('flex flex-col	gap-y-2'))} /* @TODO: Replace with stack component */>
        {label && <Label disabled={disabled}>{label}</Label>}
        <Input {...props} ref={ref} />
        {caption && (
          <Caption status={status} disabled={disabled}>
            {caption}
          </Caption>
        )}
      </div>
    );
  },
);

export default TextField;
