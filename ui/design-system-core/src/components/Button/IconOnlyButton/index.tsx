import React, { forwardRef, HTMLAttributes } from 'react';
import Stack from '../../Stack';
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
  breakPointSize: ButtonProps['breakPointSize'];
  customStyle: ButtonProps['customStyle'];
  ref?: ButtonProps['ref'];
};

export const IconOnlyButton: React.FC<IconOnlyButtonProps & HTMLAttributes<HTMLButtonElement>> =
  forwardRef(
    (
      { icon, size, variant, loading, greyBg, breakPointSize, disabled, customStyle, ...rest },
      ref,
    ) => {
      const containerStyle = getContainerClasses({ variant, loading, greyBg, disabled });
      const breakPointStyle = breakPointSize
        ? BUTTON_SIZE_MAP_BY_BREAKPOINT(breakPointSize.breakPoint)[breakPointSize.size]
        : '';

      return (
        <button ref={ref} {...rest}>
          <Stack
            align="center"
            justify="center"
            customStyle={`group rounded-full ${containerStyle} ${BUTTON_SIZE_MAP[size]} ${breakPointStyle} ${customStyle}`}
          >
            <ButtonIcon
              size={size}
              type={loading ? 'ArrowPathIcon' : icon}
              variant={variant}
              greyBg={greyBg}
              loading={loading}
              breakPointSize={breakPointSize}
              disabled={disabled}
            />
          </Stack>
        </button>
      );
    },
  );

const BUTTON_SIZE_MAP: Record<ButtonSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
};

const BUTTON_SIZE_MAP_BY_BREAKPOINT = (breakPoint: string): Record<ButtonSize, string> => ({
  xs: `${breakPoint}:h-6 ${breakPoint}:w-6`,
  sm: `${breakPoint}:h-8 ${breakPoint}:w-8`,
  md: `${breakPoint}:h-12 ${breakPoint}:w-12`,
  lg: `${breakPoint}:h-14 ${breakPoint}:w-14`,
});
