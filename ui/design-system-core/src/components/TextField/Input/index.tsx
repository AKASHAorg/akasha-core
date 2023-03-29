import React from 'react';
import Icon from '../../Icon';
import Stack from '../../Stack';
import { getContainerClasses } from './getContainerClasses';
import { getIconClasses } from './getIconClasses';
import { getInputClasses } from './getInputClasses';
import { InputProps } from '../types';
import { apply, tw } from '@twind/core';

export const Input: React.FC<InputProps & JSX.IntrinsicElements['input']> = ({
  status,
  iconLeft,
  iconRight,
  readOnly,
  disabled,
  ...rest
}) => {
  const containerStyle = getContainerClasses(disabled, status, readOnly);
  const inputStyle = getInputClasses(disabled, status, readOnly);
  const iconStyle = getIconClasses(disabled, status);

  return (
    <Stack align="center" spacing="gap-x-2" customStyle={containerStyle}>
      <input
        type="text"
        className={tw(apply`${inputStyle}`)}
        disabled={disabled}
        readOnly={readOnly}
        {...rest}
      />
      {iconLeft && (
        <Icon type={iconLeft} customStyle={`${iconStyle} order-first`} disabled={disabled} />
      )}
      {iconRight && <Icon type={iconRight} customStyle={iconStyle} disabled={disabled} />}
    </Stack>
  );
};
