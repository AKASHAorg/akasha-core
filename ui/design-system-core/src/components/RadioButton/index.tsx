import React from 'react';
import { tw, apply } from '@twind/core';

type ButtonSize = 'small' | 'large';

export type RadioButtonProps = {
  id: string;
  label: string;
  value: string;
  //button size
  size?: ButtonSize;
  //status
  isSelected?: boolean;
  error?: boolean;
  //handler
  handleChange: (e) => void;
};

const baseStyles = apply`
  flex items-center
  space-x-2 mb-2
`;

const baseButtonStyles = apply`
  inline-block mr-4 ml-0 p-0 rounded-full
  flex-no-shrink after:content-[''] after:absolute
`;

export const RadioButton: React.FC<RadioButtonProps> = props => {
  const {
    handleChange,
    id,
    label = 'Radio button',
    value = 'Radio button',
    isSelected = false,
    error = false,
    size = 'small',
  } = props;

  const textColor = error ? 'text-orange-400' : 'text(black dark:white)';
  const inputColor = error ? 'orange-400' : 'secondary-light';
  const buttonSize = size === 'small' ? 'w-4 h-4' : 'w-6 h-6';
  const pseudoCircleSize =
    size === 'small'
      ? 'after:w-2 after:h-2 after:mt-[2.5px] after:ml-[2.5px]'
      : 'after:w-4 after:h-4 after:mt-[3px] after:ml-[3px]';

  const instanceStyles = apply`
    ${baseStyles}
  `;

  const instanceButtonStyles = apply`
  ${baseButtonStyles}
  border(& ${inputColor})
`;

  return (
    <div className={tw(instanceStyles)}>
      <input
        id={id}
        onChange={handleChange}
        value={value}
        type="radio"
        checked={isSelected}
        aria-labelledby={value}
        className={tw('hidden')}
      />
      <label
        htmlFor={id}
        className={tw(apply`flex items-center cursor-pointer text-sm ${textColor}`)}
      >
        <span
          className={tw(
            isSelected
              ? apply`${buttonSize} ${instanceButtonStyles} after:block after:bg-${inputColor} after:rounded-full ${pseudoCircleSize}`
              : apply`${buttonSize} ${instanceButtonStyles} after:hidden`,
          )}
        ></span>
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
