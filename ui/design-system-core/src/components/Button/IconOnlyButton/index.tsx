import React, { HTMLAttributes } from 'react';
import Icon from '../../Icon';
import Stack from '../../Stack';
import { tw } from '@twind/core';
import { getContainerClasses } from '../getContainerClasses';
import { getIconClasses } from '../getIconClasses';
import { ButtonProps, ButtonSize } from '../types';

type IconOnlyButtonProps = {
  icon: ButtonProps['icon'];
  size: ButtonProps['size'];
  variant: ButtonProps['variant'];
  loading: ButtonProps['loading'];
  greyBg: ButtonProps['greyBg'];
  disabled: ButtonProps['disabled'];
};

export const IconOnlyButton: React.FC<IconOnlyButtonProps & HTMLAttributes<HTMLButtonElement>> = ({
  icon,
  size,
  variant,
  loading,
  greyBg,
  disabled,
  ...rest
}) => {
  const iconStyle = getIconClasses({ variant, loading, greyBg, disabled });
  const containerStyle = getContainerClasses({ variant, loading, greyBg, disabled });

  return (
    <button {...rest}>
      <Stack
        align="center"
        justify="center"
        className={tw(`group rounded-full ${containerStyle} ${BUTTON_SIZE_MAP[size]}`)}
      >
        <Icon type={loading ? 'ArrowPathIcon' : icon} size="md" styling={tw(`${iconStyle}`)} />
      </Stack>
    </button>
  );
};

const BUTTON_SIZE_MAP: Record<ButtonSize, string> = {
  xsmall: 'w-6 h-6',
  small: 'w-8 h-8',
  regular: 'w-12 h-12',
  large: 'w-14 h-14',
};
