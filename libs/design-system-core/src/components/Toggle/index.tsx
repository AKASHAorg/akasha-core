import React from 'react';

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

/**
 * The Toggle component offers a quick way to include a toggle input in your app. The component
 * supports many customization options such as size, icons for checked/unchecked states,
 * and handling changes through an event handler.
 * @param id - (optional) id if there is any
 * @param name - (optional) name of the input
 * @param label - (optional) label that will be displayed
 * @param size - (optional) for customizing the size
 * @param checked - boolean (optional) for controlling the checked state
 * @param disabled - boolean (optional) for controlling the disabled state
 * @param iconUnchecked - (optional) include an icon for unchecked state
 * @param iconChecked - (optional) include an icon for checked state
 * @param onChange - (optional) handler that will be called on change event
 * @example
 * ```tsx
 * <Toggle checked={false} label={'Agree?'} onChange={ToggleChangeHandler} size="small" />
 * ```
 **/
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

  const transitionStyle = 'after:transition-all after:duration-300';

  const knobStyle = `after:top-px after:left-0.5 ${sizeMap[size].dimension} relative rounded(full after:full) hover:shadow-md peer-focus:outline-none peer after:content-[''] after:absolute ${transitionStyle} ${color}`;

  const iconStyle = `flex items-center justify-center ${sizeMap[size].iconSize} absolute ml-1 rounded(full after:full) hover:shadow-md peer-focus:outline-none peer after:content-[''] after:absolute ${transitionStyle}`;

  const handleChange = e => {
    if (typeof onChange === 'function') {
      return onChange(e);
    }
    return null;
  };

  return (
    <label className={'inline-flex items-center cursor-pointer'}>
      <input
        id={id}
        name={name}
        aria-label="toggle"
        type="checkbox"
        value={label}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className={'sr-only peer relative invisible'} // adding 'invisible' to remove the small blue dot on Firefox
      />
      <div className={knobStyle} />

      {iconChecked && iconUnchecked && (
        <div className={iconStyle}>
          <Icon
            size={'sm'}
            icon={checked ? iconChecked : iconUnchecked}
            color="white"
            customStyle={size === 'small' ? 'size-3' : ''}
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
