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
  xsmall: { textSize: 'text-xs', iconSize: 'h-3 w-3', buttonSize: 'w-24' },
  small: { textSize: 'text-sm', iconSize: DefaultIconSize, buttonSize: 'w-48' },
  regular: { textSize: 'text-lg', iconSize: 'h-5, w-5', buttonSize: 'w-64' },
  large: { textSize: 'text-3xl', iconSize: 'h-7, w-7', buttonSize: 'w-96' },
};

const baseStyles = apply`text-center flex items-center justify-center	font-medium md:max-md:w-full`;
const textOnlyStyles = apply`
${baseStyles}
text-secondary-light dark:text-secondary-dark hover:opacity-50 
disabled:opacity-50 disabled:cursor-not-allowed space-x-2
`;

export const Button: React.FC<PropsWithChildren<ButtonProps>> = props => {
  const { label, size, greyBg, primary } = props;
  const loading = props.loading === true;
  const textonly = props.textonly === true || props.textonly !== undefined;
  const greyBgIcon =
    (greyBg === true && label === undefined) || (greyBg === true && size === 'xsmall');

  const isIconButton =
    label !== undefined && !greyBgIcon ? 'rounded-2xl space-x-2 py-2.5 px-5' : 'rounded-full p-2.5';
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
  const iconRight = props.iconRight === true ? 'flex-row-reverse space-x-2 space-x-reverse' : '';

  const buttonSize = (label !== undefined && sizing[size]?.buttonSize) ?? 'w-48';
  const textSize = sizing[size]?.textSize ?? 'text-sm';
  const iconSize = sizing[size]?.iconSize ?? DefaultIconSize;
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
      {!loading && !greyBgIcon && <p>{label}</p>}
    </button>
  );
};
