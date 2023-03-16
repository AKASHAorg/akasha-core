import React from 'react';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';
import { IconOnlyButton } from './IconOnlyButton';
import { ButtonProps, ButtonSize } from './types';
import { getTextClasses } from './getTextClasses';
import { getContainerClasses } from './getContainerClasses';
import { ButtonIcon } from './ButtonIcon';

const Button: React.FC<
  ButtonProps &
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = props => {
  const {
    plain,
    icon,
    iconDirection,
    label,
    size = 'regular',
    variant = 'secondary',
    disabled = false,
    loading = false,
    iconOnly = false,
    greyBg = false,
    children,
    ...rest
  } = props;

  if (plain) return <button {...rest}>{children}</button>;

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

  const containerStyle = getContainerClasses({ variant, loading, greyBg, disabled });
  const textStyle = getTextClasses({ variant, loading, disabled });

  return (
    <button {...rest}>
      <Stack
        align="center"
        justify="center"
        spacing="gap-x-1"
        customStyle={`group ${containerStyle} ${BUTTON_SIZE_MAP[size]}`}
      >
        {loading ? (
          <ButtonIcon
            type="ArrowPathIcon"
            variant={variant}
            greyBg={greyBg}
            loading={true}
            disabled={disabled}
          />
        ) : (
          <>
            {icon && iconDirection === 'left' && (
              <ButtonIcon
                type={icon}
                variant={variant}
                greyBg={greyBg}
                loading={false}
                disabled={disabled}
              />
            )}
            <Text
              variant={variant === 'text' ? 'button-sm' : BUTTON_SIZE_TEXT_MAP[size]}
              customStyle={textStyle}
            >
              {label}
            </Text>
            {icon && iconDirection === 'right' && (
              <ButtonIcon
                type={icon}
                variant={variant}
                greyBg={greyBg}
                loading={false}
                disabled={disabled}
              />
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
