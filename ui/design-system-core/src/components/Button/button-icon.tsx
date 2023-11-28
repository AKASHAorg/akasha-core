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
    active?: ButtonProps['active'];
  }
> = ({
  size,
  icon,
  solid,
  variant,
  greyBg,
  loading,
  breakPointSize,
  disabled,
  active,
  hoverColor,
}) => {
  let color = null;

  if (variant === 'primary' && !greyBg) {
    color = 'white';
  } else if (active) {
    color = { light: 'secondaryLight', dark: 'black' };
  }

  return (
    <Icon
      icon={icon}
      solid={solid}
      size={size}
      breakPointSize={breakPointSize}
      color={color}
      accentColor={
        (variant !== 'primary' && loading) ||
        variant === 'text' ||
        (variant === 'secondary' && !active) ||
        (variant === 'primary' && greyBg)
      }
      hoverColor={hoverColor ?? getHoverColor(variant)}
      hover={!disabled && !loading}
      customStyle={loading ? 'animate-spin' : ''}
      disabled={disabled}
    />
  );
};

const getHoverColor = (variant: ButtonProps['variant']): Color => {
  if (variant === 'text') return { light: 'secondaryDark', dark: 'white' };
  if (variant === 'secondary') return { light: 'secondaryLight', dark: 'white' };
};
