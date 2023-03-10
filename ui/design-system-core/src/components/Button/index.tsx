import React, { HTMLAttributes } from 'react';
import Icon from '../Icon';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';
import { apply, tw } from '@twind/core';
import { IconOnlyButton } from './IconOnlyButton';
import { ButtonProps, ButtonSize } from './types';
import { getTextClasses } from './getTextClasses';
import { getContainerClasses } from './getContainerClasses';
import { getIconClasses } from './getIconClasses';

const Button: React.FC<ButtonProps & HTMLAttributes<HTMLButtonElement>> = props => {
  const {
    icon,
    iconDirection,
    label,
    size = 'regular',
    variant = 'contained',
    disabled = false,
    loading = false,
    iconOnly = false,
    greyBg = false,
    ...rest
  } = props;

  if (iconOnly || size === 'xsmall') {
    if (!icon) return null;
    return (
      <IconOnlyButton
        icon={icon}
        size={size}
        variant={variant}
        loading={loading}
        greyBg={greyBg}
        disabled={disabled}
        {...rest}
      />
    );
  }

  const iconStyle = getIconClasses({ variant, loading, greyBg, disabled });
  const containerStyle = getContainerClasses({ variant, loading, greyBg, disabled });
  const textStyle = getTextClasses({ variant, loading, disabled });

  return (
    <button {...rest}>
      <Stack
        align="center"
        justify="center"
        spacing="gap-x-1"
        className={tw(apply`group ${containerStyle} ${BUTTON_SIZE_MAP[size]}`)}
      >
        {loading ? (
          <Icon type="ArrowPathIcon" size="md" styling={iconStyle} />
        ) : (
          <>
            {icon && iconDirection === 'left' && <Icon type={icon} size="md" styling={iconStyle} />}
            <Text
              variant={variant === 'text' ? 'button-sm' : BUTTON_SIZE_TEXT_MAP[size]}
              className={textStyle}
            >
              {label}
            </Text>
            {icon && iconDirection === 'right' && (
              <Icon type={icon} size="md" styling={iconStyle} />
            )}
          </>
        )}
      </Stack>
    </button>
  );
};

const BUTTON_SIZE_MAP: Record<Exclude<ButtonSize, 'xsmall'>, string> = {
  small: 'h-8 rounded-3xl px-4',
  regular: 'h-12 rounded-3xl px-6',
  large: 'h-14 rounded-[1.875rem] px-6',
};

const BUTTON_SIZE_TEXT_MAP: Record<Exclude<ButtonSize, 'xsmall'>, TextProps['variant']> = {
  small: 'button-sm',
  regular: 'button-md',
  large: 'button-lg',
};

export default Button;
