import React from 'react';
import Caption from './Caption';
import Label from './Label';
import Stack from '../Stack';
import { Input } from './Input';
import { TextFieldProps } from './types';
import { Multiline } from './Multiline';

const TextField: React.FC<TextFieldProps> = props => {
  const { inputRef, required, label, status, caption, customStyle, disabled, ...rest } = props;

  return (
    <Stack direction="column" spacing="gap-y-2" customStyle={customStyle}>
      {label && (
        <Label required={required} disabled={disabled}>
          {label}
        </Label>
      )}
      {rest.type === 'multiline' ? (
        <Multiline {...rest} ref={inputRef} />
      ) : (
        <Input {...rest} ref={inputRef} />
      )}
      {caption && (
        <Caption status={status} disabled={disabled}>
          {caption}
        </Caption>
      )}
    </Stack>
  );
};

export default TextField;
