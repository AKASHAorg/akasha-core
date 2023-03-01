import React from 'react';
import { tw } from '@twind/core';

import Icon, { IconType } from '../Icon';

type ButtonSize = 'xsmall' | 'small' | 'regular' | 'large';

export interface IButtonProps {
  label?: string;
  icon?: IconType;
  size?: ButtonSize;
  primary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: boolean;
  iconOnly?: boolean;
  textOnly?: boolean;
  greyBg?: boolean;
  onClick?: (event: React.SyntheticEvent<Element, Event>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Button: React.FC<IButtonProps> = props => {
  const {
    icon,
    label,
    size = 'regular',
    primary = false,
    disabled = false,
    loading = false,
    leftIcon = false,
    iconOnly = false,
    textOnly = false,
    greyBg = false,
    onClick,
    onMouseEnter,
    onMouseLeave,
  } = props;

  // adjust padding if iconOnly prop or loading prop or size of icon is xsmall
  const altPad = iconOnly || loading || size === 'xsmall';

  /** sets height, padding and font sizes based on specified button size */
  const ButtonSizesMap = {
    xsmall: `h-6 ${altPad ? 'p-1.5' : 'p-2.5'}`,
    small: `h-[22px] ${altPad ? 'py-4 px-2.5' : 'py-1 px-4'} text-xs`,
    regular: `h-10 ${altPad ? 'p-[0.8rem]' : 'py-2 px-6'} text-sm`,
    large: `h-[58px] ${altPad ? 'p-5' : 'py-4 px-6'} text-base`,
  };

  /** sets icon width and height matching the specified button size */
  const ButtonIconSizesMap = {
    xsmall: 'w-2.5 h-2.5',
    small: 'w-3 h-3',
    regular: 'w-3.5 h-3.5',
    large: 'w-4 h-4',
  };

  const handleClick = event => {
    if (typeof onClick === 'function' && !disabled && !loading) {
      return onClick(event);
    }
  };

  const handleMouseEnter = () => {
    if (typeof onMouseEnter === 'function' && !disabled && !loading) {
      return onMouseEnter();
    }
  };

  const handleMouseLeave = () => {
    if (typeof onMouseLeave === 'function' && !disabled && !loading) {
      return onMouseLeave();
    }
  };

  // specific styles
  const background = textOnly
    ? 'bg-none'
    : greyBg
    ? `${primary ? 'bg-grey9 dark:bg-grey3' : 'bg-none'} hover:${
        primary ? 'bg-grey9 dark:bg-grey3' : 'bg-secondary-dark'
      }`
    : primary
    ? 'bg-gradient-to-r from-primaryStart to-primaryStop'
    : 'bg-white hover:bg-secondary-dark';

  const color = greyBg
    ? 'text-white'
    : primary
    ? 'text-white'
    : 'text-secondary-light hover:text-white';

  const border = primary || textOnly ? 'border-0' : 'border-1 border-secondary-dark';

  const opacity = `opacity-${disabled ? '50' : '100'}`;

  const cursor = `cursor-${disabled || loading ? 'not-allowed' : 'pointer'}`;

  const shadow = `${primary ? 'shadow-none hover:shadow-lg shadow-elevation' : 'shadow-none'}`;

  const className = `flex items-center ${ButtonSizesMap[size]} ${background} ${color} ${border} rounded-full ${opacity} ${cursor} ${shadow}`;

  const iconStyle = `${ButtonIconSizesMap[size]} ${color} ${
    size !== 'xsmall' && !iconOnly && !loading ? (leftIcon ? 'mr-2' : 'ml-2') : 'm-0'
  }`;

  return (
    <button
      type="button"
      className={tw(className)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {loading ? (
        <Icon type="ArrowPathIcon" styling={tw(iconStyle)} />
      ) : iconOnly ? (
        <Icon type={icon} styling={tw(iconStyle)} />
      ) : (
        <>
          {leftIcon && icon && <Icon type={icon} styling={tw(iconStyle)} />}

          {size !== 'xsmall' && label}

          {!leftIcon && icon && <Icon type={icon} styling={tw(iconStyle)} />}
        </>
      )}
    </button>
  );
};

export default Button;
