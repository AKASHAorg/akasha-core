import React from 'react';

import Icon, { IconProps } from '../Icon';

import { ButtonProps } from './types';

export const ButtonIcon: React.FC<
  IconProps & {
    variant: ButtonProps['variant'];
    greyBg: ButtonProps['greyBg'];
    loading: ButtonProps['loading'];
    breakPointSize: ButtonProps['breakPointSize'];
    disabled: ButtonProps['disabled'];
    active?: ButtonProps['active'];
  }
> = ({ size, icon, solid, variant, greyBg, loading, breakPointSize, disabled, active }) => {
  return (
    <Icon
      icon={icon}
      solid={solid}
      size={size === 'xs' ? 'sm' : size}
      breakPointSize={breakPointSize}
      accentColor={
        (variant !== 'primary' && loading) ||
        variant === 'text' ||
        (variant === 'secondary' && !active) ||
        (variant === 'primary' && greyBg)
      }
      customStyle={loading ? 'animate-spin' : ''}
      disabled={disabled}
    />
  );
};
