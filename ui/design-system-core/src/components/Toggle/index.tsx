import React from 'react';
import Icon, { IconName } from '../Icon';
import Text from '../Text';
import { tw, apply } from '@twind/core';

export type toggleSize = 'small' | 'large';

export interface iToggleProps {
  id?: string;
  label?: string;
  size?: toggleSize;
  // status
  checked?: boolean;
  disabled?: boolean;
  iconUnchecked?: IconName;
  iconChecked?: IconName;
}

const Toggle: React.FC<iToggleProps> = ({
  id = 'toggle',
  label = '',
  disabled = false,
  checked = false,
  iconChecked = null,
  iconUnchecked = null,
  size = 'small',
}) => {
  const [enabled, setEnabled] = React.useState(checked);

  const buttonSize = size === 'large' ? 'h-8 w-16' : 'h-5 w-9';

  //For defining the margin between the outer button and the inner circle
  const spacingProperties =
    size === 'large'
      ? 'after:absolute after:top-px after:left-0.5'
      : 'after:absolute after:top-px after:left-0.5';

  //For defining the width and height of the inner circle and how much it will move when the button is toggled
  const pseudoCircleSizingProperties =
    size === 'large'
      ? 'after:h-7 after:w-7 peer-checked:after:translate-x-[1.9rem]'
      : 'after:h-4 after:w-4 peer-checked:after:translate-x-3.5';

  //For defining the width and height of the icon and how much it will move when the button is toggled
  const iconSizingProperties =
    size === 'large'
      ? 'h-6 w-6 peer-checked:translate-x-[1.95rem]'
      : 'h-3 w-3 peer-checked:translate-x-[0.95rem]';

  // Setting the color of the button and circle in two cases: disabled and normal button.
  const color = disabled
    ? 'bg-grey7 border([1px] grey4) after:bg-grey4'
    : 'bg-white dark:bg-grey3 border([1px] secondary-light) after:bg-grey6';

  const baseTransitionStyle = 'after:transition-all after:duration-300';

  const instanceButtonStyle = apply`
      relative
      ${buttonSize}
      rounded-full
      hover:shadow-md
      ${color}
      ${spacingProperties}
      ${pseudoCircleSizingProperties}
      after:rounded-full after:border after:border-grey6
      peer-checked:bg-white peer-checked:after:border-secondary-light peer-checked:after:bg-secondary-light
      ${baseTransitionStyle}
      `;
  const instanceIconStyle = apply`
      absolute ml-1
      ${iconSizingProperties}
      ${baseTransitionStyle}
      peer-checked:transition-all peer-checked:duration-300
      `;

  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-center">
        <input
          type="checkbox"
          id={id}
          disabled={disabled}
          className="peer sr-only"
          onClick={() => setEnabled(!enabled)}
        />
        <div className={tw(instanceButtonStyle)}></div>

        {iconChecked && iconUnchecked && (
          <Icon
            icon={enabled ? iconChecked : iconUnchecked}
            styling={tw(instanceIconStyle)}
            fillColor="white"
            strokeColor="white"
            iconType="solid"
          />
        )}

        <span className="pl-2 text-base text-gray-800">
          <Text variant="label">{label}</Text>
        </span>
      </label>
    </div>
  );
};

export default Toggle;
