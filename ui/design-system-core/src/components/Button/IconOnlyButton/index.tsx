import React, { HTMLAttributes } from 'react';
import Stack from '../../Stack';
import Button from '..';
import { tw } from '@twind/core';
import { getContainerClasses } from '../getContainerClasses';
import { ButtonProps, ButtonSize } from '../types';
import { ButtonIcon } from '../ButtonIcon';

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
  const containerStyle = getContainerClasses({ variant, loading, greyBg, disabled });

  return (
    <Button {...rest} plain>
      <Stack
        align="center"
        justify="center"
        customStyle={tw(`group rounded-full ${containerStyle} ${BUTTON_SIZE_MAP[size]}`)}
      >
        <ButtonIcon
          type={loading ? 'ArrowPathIcon' : icon}
          variant={variant}
          greyBg={greyBg}
          loading={loading}
          disabled={disabled}
        />
      </Stack>
    </Button>
  );
};

const BUTTON_SIZE_MAP: Record<ButtonSize, string> = {
  xsmall: 'w-6 h-6',
  small: 'w-8 h-8',
  regular: 'w-12 h-12',
  large: 'w-14 h-14',
};
