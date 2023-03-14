import React from 'react';

import Icon, { IconProps } from '../Icon';
import { ButtonProps } from './types';

export const ButtonIcon: React.FC<
  IconProps & {
    variant: ButtonProps['variant'];
    greyBg: ButtonProps['greyBg'];
    loading: ButtonProps['loading'];
    disabled: ButtonProps['disabled'];
  }
> = ({ type, variant, greyBg, loading, disabled }) => {
  return (
    <Icon
      type={type}
      size="md"
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

const getHoverColor = (variant: ButtonProps['variant']) => {
  if (variant === 'text') return { light: 'secondary-dark', dark: 'white' };
  if (variant === 'secondary') return { light: 'secondary-light', dark: 'white' };

  return '';
};
