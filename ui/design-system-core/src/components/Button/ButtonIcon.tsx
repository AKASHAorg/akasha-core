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
> = ({ type, styling, variant, greyBg, loading, disabled }) => {
  const getHoverColor = () => {
    if (variant === 'text') return { light: 'secondary-dark', dark: 'white' };
    if (variant === 'secondary') return { light: 'secondary-light', dark: 'white' };

    return '';
  };
  return (
    <Icon
      type={type}
      size="md"
      styling={`${disabled ? 'opacity-50' : ''} ${styling}`}
      color={variant === 'primary' ? 'white' : ''}
      accentColor={
        (variant !== 'primary' && loading) ||
        variant === 'text' ||
        variant === 'secondary' ||
        (variant === 'primary' && greyBg)
      }
      hoverColor={getHoverColor()}
      hover={!disabled && !loading}
      disabled={disabled}
    />
  );
};
