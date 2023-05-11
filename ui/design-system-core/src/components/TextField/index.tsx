import React from 'react';
import Caption from './Caption';
import Label from './Label';
import Stack from '../Stack';
import { Input } from './Input';
import { TextFieldProps } from './types';
import { Multiline } from './Multiline';

const TextField: React.FC<TextFieldProps> = props => {
  const { required, label, status, caption, disabled, customStyle, inputRef, ...rest } = props;

  return (
    <Stack direction="column" spacing="gap-y-2" customStyle={customStyle}>
      {label && (
        <Label required={required} disabled={disabled}>
          {label}
        </Label>
      )}
      {rest.type === 'multiline' ? (
        <Multiline
          required={required}
          status={status}
          disabled={disabled}
          ref={inputRef}
          {...rest}
        />
      ) : (
        <Input required={required} status={status} disabled={disabled} ref={inputRef} {...rest} />
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
