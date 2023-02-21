import React from 'react';
import Icon, { IconName } from '../Icon';
import { tw } from '@twind/core';

export type toggleSize = 'small' | 'large';

export interface iToggleProps {
  id?: string;
  label: string;
  size?: toggleSize;
  // status
  checked?: boolean;
  disabled?: boolean;
  iconUnchecked?: IconName;
  iconChecked?: IconName;
}

const Toggle: React.FC<iToggleProps> = ({
  id = 'toggle',
  label,
  disabled = false,
  checked = false,
  iconChecked = null,
  iconUnchecked = null,
  size = 'small',
}) => {
  const [enabled, setEnabled] = React.useState(checked);

  const buttonSize = size === 'large' ? 'h-8 w-16' : 'h-5 w-9';
  const spacingProperties =
    size === 'large'
      ? 'after:absolute after:top-0.5 after:left-0.5'
      : 'after:absolute after:top-1 after:left-0.5';
  const pseudoCircleProperties =
    size === 'large'
      ? 'after:h-7 after:w-7 peer-checked:after:translate-x-8'
      : 'after:h-4 after:w-4 peer-checked:after:translate-x-4';
  const iconProperties =
    size === 'large' ? 'h-6 w-6 peer-checked:translate-x-8' : 'h-3 w-3 peer-checked:translate-x-4';
  const color = disabled
    ? 'bg-grey7 border(1 grey4) after:bg-grey4'
    : 'bg-white dark:bg-grey3 border(1 secondary-light) after:bg-grey4';

  return (
    <div className="">
      <label htmlFor="toggle" className="relative flex cursor-pointer items-center">
        <input
          type="checkbox"
          id={id}
          disabled={disabled}
          className="peer sr-only"
          onClick={() => setEnabled(!enabled)}
        />
        <div
          className={tw(
            `${buttonSize} rounded-full ${color} hover:shadow-md ${spacingProperties} ${pseudoCircleProperties} after:rounded-full after:border after:border-grey6 after:bg-grey6 after:transition-all after:duration-300 peer-checked:bg-white peer-checked:after:border-secondary-light peer-checked:after:bg-secondary-light`,
          )}
        ></div>

        {iconChecked && iconUnchecked && (
          <Icon
            icon={enabled ? iconChecked : iconUnchecked}
            styling={tw(
              `absolute ml-1 ${iconProperties} transition-all duration-700 peer-checked:transition-all peer-checked:duration-700`,
            )}
            fillColor="white"
            strokeColor="white"
            iconType="solid"
          />
        )}

        <span className="ml-2 text-base text-gray-800">{label}</span>
      </label>
    </div>
  );
};

export default Toggle;
