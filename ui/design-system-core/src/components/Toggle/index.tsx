import React from 'react';
import { tw, apply } from '@twind/core';

import Icon from '../Icon';
import Text from '../Text';

export type toggleSize = 'small' | 'large';

export type ToggleProps = {
  id?: string;
  name?: string;
  label?: string;
  size?: toggleSize;
  // status
  checked?: boolean;
  disabled?: boolean;
  //toggle with icons
  iconUnchecked?: React.ReactElement;
  iconChecked?: React.ReactElement;
  onChange?: (ev: React.SyntheticEvent) => void;
};

const Toggle: React.FC<ToggleProps> = ({
  id,
  name,
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
      dimension: 'h-8 w-16 after:h-7 after:w-7 peer-checked:after:translate-x-[1.9rem]',
      iconSize: 'h-6 w-6 peer-checked:translate-x-[1.95rem]',
    },
    small: {
      dimension: 'h-5 w-9 after:h-4 after:w-4 peer-checked:after:translate-x-3.5',
      iconSize: 'h-3 w-3 peer-checked:translate-x-[0.90rem]',
    },
  };

  const color = disabled
    ? 'bg(grey7 after:grey4) border(1 grey4 after:grey7)'
    : `bg(white dark:grey3 ${
        iconUnchecked ? 'after:secondaryDark' : 'after:grey6'
      } dark:after:secondaryDark peer-checked:after:secondaryLight peer-checked:dark:after:secondaryLight) peer-checked:after:border-secondaryLight border(1 secondaryLight dark:secondaryDark peer-checked:after:red-500 peer-checked:dark:after:red-500)`;

  const transitionStyle = 'transition-all duration-300';

  const knobStyle = apply`after:top-px after:left-0.5 ${sizeMap[size].dimension} relative rounded(full after:full) hover:shadow-md peer-focus:outline-none peer after:content-[''] after:absolute after:${transitionStyle} ${color}`;

  const iconStyle = apply`flex items-center justify-center ${sizeMap[size].iconSize} absolute ml-1 rounded(full after:full) hover:shadow-md peer-focus:outline-none peer after:content-[''] after:absolute after:${transitionStyle}`;

  const handleChange = e => {
    if (typeof onChange === 'function') {
      return onChange(e);
    }
    return null;
  };

  return (
    <label className={tw('inline-flex items-center cursor-pointer')}>
      <input
        id={id}
        name={name}
        type="checkbox"
        value=""
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className={tw('sr-only peer relative invisible')} // adding 'invisible' to remove the small blue dot on Firefox
      />
      <div className={tw(knobStyle)} />

      {iconChecked && iconUnchecked && (
        <div className={tw(iconStyle)}>
          <Icon
            size={size === 'small' ? { width: 'w-3', height: 'h-3' } : 'sm'}
            icon={checked ? iconChecked : iconUnchecked}
            color="white"
          />
        </div>
      )}

      {label && (
        <Text
          variant="label"
          customStyle="ml-3"
          color={{ light: 'secondaryDark', dark: 'secondaryLight' }}
        >
          {label}
        </Text>
      )}
    </label>
  );
};

export default Toggle;
