import React from 'react';
import Icon from '../../Icon';
import Stack from '../../Stack';
import { getContainerClasses } from './getContainerClasses';
import { getIconClasses } from './getIconClasses';
import { getInputClasses } from './getInputClasses';
import { InputProps } from '../types';
import { apply, tw } from '@twind/core';
import { forwardRef } from 'react';
import { getRadiusClasses } from '../../../utils/getRadiusClasses';

export const Input: React.FC<InputProps> = forwardRef(
  (
    { id, radius, status, iconLeft, iconRight, readOnly, disabled, altBg, fullWidth, ...rest },
    ref,
  ) => {
    const containerStyle = getContainerClasses(disabled, status, readOnly, altBg);
    const inputStyle = getInputClasses(disabled, status, readOnly);
    const iconColor = getIconClasses(status, disabled);
    const radiusStyle = getRadiusClasses(radius);

    return (
      <Stack
        direction="row"
        align="center"
        spacing="gap-x-2"
        customStyle={`${containerStyle} ${radiusStyle}`}
        fullWidth={fullWidth}
      >
        {iconLeft && <Icon icon={iconLeft} color={iconColor} disabled={disabled} />}
        <input
          ref={ref}
          type="text"
          className={tw(apply`${inputStyle}`)}
          disabled={disabled}
          readOnly={readOnly}
          aria-labelledby={id}
          {...rest}
        />
        {iconRight && <Icon icon={iconRight} color={iconColor} disabled={disabled} />}
      </Stack>
    );
  },
);
