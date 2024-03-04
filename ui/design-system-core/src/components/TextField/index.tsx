import React from 'react';

import Stack from '../Stack';

import Caption from './Caption';
import { Input } from './Input';
import Label from './Label';
import { Multiline } from './Multiline';

import { TextFieldProps } from './types';

const TextField: React.FC<TextFieldProps> = props => {
  const {
    id,
    required,
    label,
    status,
    caption,
    disabled,
    justifyCaption,
    customStyle = '',
    inputRef,
    ...rest
  } = props;

  return (
    <Stack direction="column" spacing="gap-y-2" customStyle={customStyle}>
      {label && (
        <Label id={id} required={required} disabled={disabled}>
          {label}
        </Label>
      )}
      {rest.type === 'multiline' ? (
        <Multiline
          id={id}
          required={required}
          status={status}
          disabled={disabled}
          ref={inputRef}
          {...rest}
        />
      ) : (
        <Input
          id={id}
          required={required}
          status={status}
          disabled={disabled}
          ref={inputRef}
          {...rest}
        />
      )}
      {caption && (
        <Caption justifyContents={justifyCaption} status={status}>
          {caption}
        </Caption>
      )}
    </Stack>
  );
};
export default TextField;
