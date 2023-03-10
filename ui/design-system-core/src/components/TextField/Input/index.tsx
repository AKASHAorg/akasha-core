import React, { forwardRef } from 'react';
import Icon from '../../Icon';
import Stack from '../../Stack';
import { getContainerClasses } from './getContainerClasses';
import { getIconClasses } from './getIconClasses';
import { getInputClasses } from './getInputClasses';
import { InputProps } from '../types';
import { tw } from '@twind/core';

export const Input: React.FC<InputProps> = forwardRef(
  (
    { status, iconLeft, iconRight, disabled, className, ...rest },
    ref?: React.RefObject<HTMLInputElement>,
  ) => {
    const containerStyle = getContainerClasses(disabled, status);
    const inputStyle = getInputClasses(disabled, status);
    const iconStyle = getIconClasses(disabled, status);

    return (
      <Stack align="center" spacing="gap-x-2" className={`${containerStyle} ${className}`}>
        <input type="text" className={tw(inputStyle)} disabled={disabled} ref={ref} {...rest} />
        {iconLeft && (
          <Icon type={iconLeft} styling={`${iconStyle} order-first`} disabled={disabled} />
        )}
        {iconRight && <Icon type={iconRight} styling={iconStyle} disabled={disabled} />}
      </Stack>
    );
  },
);
