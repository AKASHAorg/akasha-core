import React, { forwardRef } from 'react';
import Icon from '../../Icon';
import { apply, tw } from '@twind/core';
import { getContainerClasses } from './getContainerClasses';
import { getIconClasses } from './getIconClasses';
import { getInputClasses } from './getInputClasses';
import { InputProps } from '../types';

export const Input: React.FC<InputProps> = forwardRef(
  (
    { status, iconLeft, iconRight, disabled, className, ...rest },
    ref?: React.RefObject<HTMLInputElement>,
  ) => {
    const containerStyle = getContainerClasses(disabled, status);
    const inputStyle = getInputClasses(disabled, status);
    const iconStyle = getIconClasses(disabled, status);

    return (
      <div
        className={tw(apply(containerStyle, className))}
        /* @TODO: Replace with stack component */
      >
        <input
          type="text"
          className={tw(apply(inputStyle))}
          disabled={disabled}
          ref={ref}
          {...rest}
        />
        {iconLeft && <Icon type={iconLeft} customStyle={tw(apply(`${iconStyle} order-first`))} />}
        {iconRight && <Icon type={iconRight} customStyle={iconStyle} />}
      </div>
    );
  },
);
