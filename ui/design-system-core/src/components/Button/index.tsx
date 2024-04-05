import React, { forwardRef } from 'react';
import { apply, tw } from '@twind/core';

import { ButtonIcon } from './button-icon';
import { IconOnlyButton } from './IconOnlyButton';

import Stack from '../Stack';
import { ArrowPathIcon } from '../Icon/hero-icons-outline';
import Text, { TextProps } from '../Text';

import { ButtonProps, ButtonSize } from './types';

import { getTextClasses } from './getTextClasses';
import { getContainerClasses } from './getContainerClasses';

const Button: React.FC<ButtonProps> = forwardRef((props, ref) => {
  const {
    plain,
    icon,
    iconDirection,
    label,
    size = 'sm',
    variant = 'secondary',
    disabled = false,
    loading = false,
    iconOnly = false,
    greyBg = false,
    plainIcon = false,
    solidIcon = false,
    children,
    breakPointSize,
    customStyle = '',
    active,
    hover = true,
    hoverColors,
    ...rest
  } = props;

  if (plain) {
    const disabledStyle = disabled ? 'opacity-50' : '';
    return (
      <button
        ref={ref}
        type="button"
        className={tw(`${disabledStyle} ${customStyle}`)}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }

  if (iconOnly || size === 'xs') {
    if (!icon) return null;
    return (
      <IconOnlyButton
        icon={icon}
        solidIcon={solidIcon}
        size={size}
        variant={variant}
        loading={loading}
        greyBg={greyBg}
        plainIcon={plainIcon}
        disabled={disabled}
        breakPointSize={breakPointSize}
        customStyle={customStyle}
        active={active}
        hover={hover}
        hoverColors={hoverColors}
        ref={ref}
        {...rest}
      />
    );
  }

  const containerStyle = getContainerClasses({
    variant,
    loading,
    greyBg,
    disabled,
    active,
    hover,
    hoverColors,
  });
  const textStyle = getTextClasses({ variant, loading, disabled, hover, hoverColors, active });
  const breakPointStyle = breakPointSize
    ? BUTTON_SIZE_MAP_BY_BREAKPOINT(breakPointSize.breakPoint)[breakPointSize.size]
    : '';
  const buttonSizeStyle = variant !== 'text' ? BUTTON_SIZE_MAP[size] : '';
  const buttonPaddingStyle = variant !== 'text' ? BUTTON_SIZE_PADDING_MAP[size] : '';

  return (
    <button ref={ref} className={tw(customStyle)} type="button" {...rest} disabled={disabled}>
      <Stack
        direction="row"
        align="center"
        justify="center"
        spacing="gap-x-1"
        customStyle={apply`group ${containerStyle} ${buttonSizeStyle} ${breakPointStyle} ${buttonPaddingStyle}`}
      >
        {loading ? (
          <ButtonIcon
            size={size}
            icon={<ArrowPathIcon />}
            variant={variant}
            greyBg={greyBg}
            loading={true}
            breakPointSize={breakPointSize}
            disabled={disabled}
            customStyle={customStyle}
          />
        ) : (
          <>
            {icon && iconDirection === 'left' && (
              <ButtonIcon
                size={size}
                icon={icon}
                solid={solidIcon}
                variant={variant}
                greyBg={greyBg}
                loading={false}
                breakPointSize={breakPointSize}
                disabled={disabled}
                active={active}
                hoverColor={hover ? hoverColors?.icon : null}
              />
            )}
            <Text variant={BUTTON_SIZE_TEXT_MAP[size]} as="span" customStyle={textStyle}>
              {label}
            </Text>
            {icon && iconDirection === 'right' && (
              <ButtonIcon
                size={size}
                icon={icon}
                solid={solidIcon}
                variant={variant}
                greyBg={greyBg}
                loading={false}
                breakPointSize={breakPointSize}
                disabled={disabled}
                active={active}
                hoverColor={hover ? hoverColors?.icon : null}
              />
            )}
          </>
        )}
      </Stack>
    </button>
  );
});

export const BUTTON_SIZE_MAP: Record<Exclude<ButtonSize, 'xs'>, string> = {
  sm: 'h-8 rounded-3xl',
  md: 'h-12 rounded-3xl',
  lg: 'h-14 rounded-[1.875rem]',
};

export const BUTTON_SIZE_PADDING_MAP: Record<Exclude<ButtonSize, 'xs'>, string> = {
  sm: 'px-4',
  md: 'px-6',
  lg: 'px-6',
};

export const BUTTON_SIZE_TEXT_MAP: Record<Exclude<ButtonSize, 'xs'>, TextProps['variant']> = {
  sm: 'button-sm',
  md: 'button-md',
  lg: 'button-lg',
};

const BUTTON_SIZE_MAP_BY_BREAKPOINT = (
  breakPoint: string,
): Record<Exclude<ButtonSize, 'xs'>, string> => ({
  sm: `${breakPoint}:h-8`,
  md: `${breakPoint}:h-12`,
  lg: `${breakPoint}:h-14`,
});

export default Button;
