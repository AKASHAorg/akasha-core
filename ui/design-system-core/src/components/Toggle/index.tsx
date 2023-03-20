import React from 'react';
import { tw, apply } from '@twind/core';

import { IconType } from '@akashaorg/typings/ui';

import Icon from '../Icon';
import Text from '../Text';

export type toggleSize = 'small' | 'large';

export interface IToggleProps {
  label?: string;
  size?: toggleSize;
  // status
  checked?: boolean;
  disabled?: boolean;
  //toggle with icons
  iconUnchecked?: IconType;
  iconChecked?: IconType;
  onChange?: (ev: React.SyntheticEvent) => void;
}

const Toggle: React.FC<IToggleProps> = ({
  label,
  size = 'small',
  checked = false,
  disabled = false,
  iconUnchecked = null,
  iconChecked = null,
  onChange,
}) => {
  const sizeMap = {
    large: {
      dimension: 'h-8 w-16 after:h-7 after:w-7 after:top-[2px] after:left-[4px]',
      iconSize: 'h-6 w-6 peer-checked:translate-x-[1.95rem]',
    },
    small: {
      dimension: 'h-5 w-9 after:h-4 after:w-4 after:top-[2px] after:left-[2px]',
      iconSize: 'h-3 w-3 peer-checked:translate-x-[0.95rem]',
    },
  };

  const color = disabled
    ? 'bg(grey7 after:grey4) border(1 grey4 after:grey7)'
    : `bg(white dark:grey3 after:grey6 dark:after:grey4 peer-checked:secondary-dark peer-checked:dark:secondary-light peer-checked:after:secondary-light peer-checked:dark:after:secondary-dark) border(1 secondary-light dark:secondary-dark peer-checked:after:secondary-light peer-checked:dark:after:secondary-dark)`;

  const knobStyle = apply`${sizeMap[size].dimension} rounded(full after:full) hover:shadow-md peer-focus:outline-none peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:transition-all ${color}`;

  const iconStyle = apply`flex items-center justify-center ${sizeMap[size].iconSize} absolute ml-1 rounded(full after:full) hover:shadow-md peer-focus:outline-none peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:transition-all ${color}`;

  const handleChange = e => {
    if (typeof onChange === 'function') {
      return onChange(e);
    }
    return null;
  };

  return (
    <label className={tw('relative inline-flex items-center cursor-pointer')}>
      <input
        type="checkbox"
        value=""
        name="toggle"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className={tw('sr-only peer')}
      />
      <div className={tw(knobStyle)} />

      {iconChecked && iconUnchecked && (
        <div className={tw(iconStyle)}>
          <Icon
            size={size === 'small' ? 'xs' : 'sm'}
            type={checked ? iconChecked : iconUnchecked}
            customStyle="fill-white stroke-white"
          />
        </div>
      )}

      {label && (
        <Text
          variant="label"
          customStyle="ml-3"
          color={{ light: 'text-secondary-dark', dark: 'text-secondary-light' }}
        >
          {label}
        </Text>
      )}
    </label>
  );
};

export default Toggle;
