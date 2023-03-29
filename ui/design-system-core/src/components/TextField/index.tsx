import React, { forwardRef } from 'react';
import Caption from './Caption';
import Label from './Label';
import Stack from '../Stack';
import { Input } from './Input';
import { TextFieldProps } from './types';
import { Multiline } from './Multiline';

const TextField: React.FC<TextFieldProps> = forwardRef(
  (props, ref?: React.RefObject<HTMLInputElement & HTMLTextAreaElement>) => {
    const { required, label, status, caption, customStyle, disabled } = props;

    return (
      <Stack direction="column" spacing="gap-y-2" customStyle={customStyle}>
        {label && (
          <Label required={required} disabled={disabled}>
            {label}
          </Label>
        )}
        {props.type === 'multiline' ? (
          <Multiline {...props} ref={ref} />
        ) : (
          <Input {...props} ref={ref} />
        )}
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
