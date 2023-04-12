import React from 'react';

import Icon, { IconProps } from '../Icon';
import { ButtonProps } from './types';
import { Color } from '../types/common.types';

export const ButtonIcon: React.FC<
  IconProps & {
    variant: ButtonProps['variant'];
    greyBg: ButtonProps['greyBg'];
    loading: ButtonProps['loading'];
    breakPointSize: ButtonProps['breakPointSize'];
    disabled: ButtonProps['disabled'];
  }
> = ({ size, type, variant, greyBg, loading, breakPointSize, disabled }) => {
  return (
    <Icon
      type={type}
      size={size}
      breakPointSize={breakPointSize}
      color={variant === 'primary' && !greyBg ? 'white' : ''}
      accentColor={
        (variant !== 'primary' && loading) ||
        variant === 'text' ||
        variant === 'secondary' ||
        (variant === 'primary' && greyBg)
      }
      hoverColor={getHoverColor(variant)}
      hover={!disabled && !loading}
      disabled={disabled}
    />
  );
};

const getHoverColor = (variant: ButtonProps['variant']): Color => {
  if (variant === 'text') return { light: 'secondaryDark', dark: 'white' };
  if (variant === 'secondary') return { light: 'secondaryLight', dark: 'white' };
};
