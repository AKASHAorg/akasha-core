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

const baseStyles = 'flex items-center space-x-2 mb-2';

const baseButtonStyles =
  'flex items-center justify-center mr-4 ml-0 p-0 rounded-full shrink-0 after:content-[] after:absolute';

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

  const textColor = error ? 'text(errorLight dark:errorDark)' : 'text(black dark:white)';
  const inputColor = error ? 'errorLight dark:errorDark' : 'secondaryLight dark:secondaryDark';
  const buttonSize = size === 'small' ? 'w-4 h-4' : 'w-6 h-6';
  const pseudoCircleSize = size === 'small' ? 'after:w-2 after:h-2' : 'after:w-4 after:h-4 ';

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
        type="radio"
        value={value}
        className="hidden"
        checked={isSelected}
        aria-labelledby={value}
        onChange={handleChange}
      />
      <label htmlFor={id} className={tw(`flex items-center cursor-pointer text-sm ${textColor}`)}>
        <span
          className={tw(
            isSelected
              ? `${buttonSize} ${instanceButtonStyles} after:block after:bg-(${inputColor}) after:rounded-full ${pseudoCircleSize}`
              : `${buttonSize} ${instanceButtonStyles} after:hidden`,
          )}
        ></span>
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
