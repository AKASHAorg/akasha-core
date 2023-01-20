import React, { PropsWithChildren } from 'react';
import { tw, apply } from '@twind/core';
import { Icon } from '../Icon';
import { IconName } from '../Icon/Icon';

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
  greyBg?: boolean;
  textonly?: boolean;
};

const sizing = {
  xsmall: { textSize: 'text-xs', iconSize: 'h-3 w-3', buttonSize: 'w-1/12' },
  small: { textSize: 'text-sm', iconSize: DefaultIconSize, buttonSize: 'w-2/12' },
  regular: { textSize: 'text-lg', iconSize: 'h-5, w-5', buttonSize: 'w-3/12' },
  large: { textSize: 'text-3xl', iconSize: 'h-7, w-7', buttonSize: 'w-4/12' },
};

const baseStyles = apply`text-center flex items-center justify-center	font-medium`;
const textOnlyStyles = apply`
${baseStyles}
text-secondary-light dark:text-secondary-dark hover:opacity-50 
disabled:opacity-50 disabled:cursor-not-allowed space-x-2
`;

export const Button: React.FC<PropsWithChildren<ButtonProps>> = props => {
  const loading = props.loading === true;
  const textonly = props.textonly === true || props.textonly !== undefined;
  const greyBgIcon =
    (props.greyBg === true && props.label === undefined) ||
    (props.greyBg === true && props.size === 'xsmall');

  const isIconButton =
    props.label !== undefined && !greyBgIcon
      ? 'rounded-2xl space-x-2 py-2.5'
      : 'rounded-full p-2.5';
  const bgColor = props.primary
    ? greyBgIcon
      ? 'bg-grey8'
      : 'bg-primary'
    : ' bg-white hover:bg-secondary-dark';
  const textColor =
    props.primary && !textonly
      ? 'text-white'
      : props.primary && textonly
      ? 'text-secondary-light dark:text-secondary-dark'
      : 'text-secondary-light dark:text-white';
  const border = props.primary
    ? ''
    : 'dark:border-1 dark:border-secondary-dark border-1 border-secondary-light';
  const iconRight = props.iconRight === true ? 'flex-row-reverse space-x-2 space-x-reverse' : '';

  const buttonSize = (props.label !== undefined && sizing[props.size]?.buttonSize) ?? 'w-1/12';
  const textSize = sizing[props.size]?.textSize ?? 'text-sm';
  const iconSize = sizing[props.size] ? sizing[props.size]?.iconSize : DefaultIconSize;
  const iconColor = greyBgIcon
    ? 'text-secondary-light'
    : textonly
    ? 'text-secondary-light hover:opacity-50 disabled:opacity-50'
    : 'fill-current';
  const disabled = props.disabled ? 'opacity-50 cursor-not-allowed' : '';

  const instanceStyles = textonly
    ? textOnlyStyles
    : apply`
  ${baseStyles}
  ${bgColor}
  ${textColor}
  ${border}
  ${isIconButton}
  ${iconRight}
  ${buttonSize}
  ${textSize}
  ${disabled}
`;

  const instanceIconStyles = apply`
  ${iconSize}
  ${iconColor}
  `;

  return loading ? (
    <button type="button" className={tw(instanceStyles)}>
      {<Icon icon="ArrowPathIcon" styling={`${DefaultIconSize} ${textColor}`} />}
    </button>
  ) : (
    <button type="button" className={tw(instanceStyles)}>
      {<Icon icon={props.icon} styling={tw(instanceIconStyles)} />}
      {!loading && !greyBgIcon && <p>{props.label}</p>}
    </button>
  );
};
