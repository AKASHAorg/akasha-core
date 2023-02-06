import React, { PropsWithChildren } from 'react';
import { tw, apply } from '@twind/core';

import Icon, { IconName } from '../Icon';

const DefaultIconSize = 'h-4, w-4';

export type ButtonProps = {
  primary?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  icon?: IconName;
  iconRight?: boolean;
  label?: string;
  loading?: boolean;
  size?: 'xsmall' | 'small' | 'regular' | 'large';
  fontSize?: string;
  greyBg?: boolean;
  textonly?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const sizing = {
  xsmall: { textSize: 'text-xs', iconSize: 'h-3 w-3', buttonSize: 'w-24' },
  small: { textSize: 'text-sm', iconSize: DefaultIconSize, buttonSize: 'w-[8rem]' },
  regular: { textSize: 'text-lg', iconSize: 'h-5, w-5', buttonSize: 'w-64' },
  large: { textSize: 'text-3xl', iconSize: 'h-7, w-7', buttonSize: 'w-96' },
};

const baseStyles = apply`text-center flex items-center justify-center	font-medium md:max-md:w-full hover:drop-shadow-md`;

const textOnlyStyles = apply`
${baseStyles}
text-secondary-light dark:text-secondary-dark hover:opacity-50 dark:hover:text-white
disabled:opacity-50 disabled:cursor-not-allowed space-x-2
`;

export const Button: React.FC<PropsWithChildren<ButtonProps>> = props => {
  const {
    label,
    size = 'small',
    fontSize,
    greyBg,
    primary,
    disabled = false,
    icon,
    iconRight,
    loading,
    textonly,
    onClick,
    onMouseEnter,
    onMouseLeave,
  } = props;

  const greyBgIcon =
    (greyBg === true && label === undefined) || (greyBg === true && size === 'xsmall');

  const isIconButton =
    label !== undefined && !greyBgIcon ? 'rounded-2xl space-x-2 py-2 px-4' : 'rounded-full p-2.5';
  const bgColor = primary
    ? greyBgIcon
      ? 'bg-grey8'
      : 'bg-primary'
    : ' bg-white hover:bg-secondary-dark';
  const textColor =
    primary && !textonly
      ? 'text-white'
      : primary && textonly
      ? 'text-secondary-light dark:text-secondary-dark'
      : 'text-secondary-light dark:text-white';
  const border = primary
    ? ''
    : 'dark:border-1 dark:border-secondary-dark border-1 border-secondary-light';
  const iconRightStyles = iconRight ? 'flex-row-reverse space-x-2 space-x-reverse' : '';

  const buttonSize = (label !== undefined && sizing[size]?.buttonSize) ?? 'w-48';
  const textSize = (fontSize || sizing[size]?.textSize) ?? 'text-sm';
  const iconSize = sizing[size]?.iconSize ?? DefaultIconSize;
  const iconColor = greyBgIcon
    ? 'text-secondary-light'
    : textonly
    ? 'text-secondary-light hover:opacity-50 disabled:opacity-50 dark:hover:text-white'
    : 'fill-current';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const instanceStyles = textonly
    ? textOnlyStyles
    : apply`
  ${baseStyles}
  ${bgColor}
  ${textColor}
  ${border}
  ${isIconButton}
  ${iconRightStyles}
  ${buttonSize}
  ${textSize}
  ${disabledStyles}
`;

  const instanceIconStyles = apply`
  ${iconSize}
  ${iconColor}
  `;

  const handleClick = () => {
    if (onClick !== undefined && !disabled) {
      return onClick();
    }
  };

  return loading ? (
    <button
      type="button"
      className={tw(instanceStyles)}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Icon icon="ArrowPathIcon" styling={`${DefaultIconSize} ${textColor}`} />
    </button>
  ) : (
    <button
      type="button"
      className={tw(instanceStyles)}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {icon && <Icon icon={icon} styling={tw(instanceIconStyles)} />}
      {!loading && !greyBgIcon && <p>{label}</p>}
    </button>
  );
};
