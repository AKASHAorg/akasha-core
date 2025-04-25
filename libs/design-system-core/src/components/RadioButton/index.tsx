import React from 'react';

type RadioButtonSize = 'small' | 'large';

export type RadioButtonProps = {
  id: string;
  label: string;
  value: string;
  // button size
  size?: RadioButtonSize;
  // status
  isSelected?: boolean;
  error?: boolean;
  // handler
  handleChange: (e: React.ChangeEvent) => void;
};

const baseStyles = 'flex items-center mb-2';

const baseButtonStyles =
  'flex items-center justify-center mr-2 ml-0 p-0 rounded-full shrink-0 after:content-[] after:absolute';

/**
 * A RadioButton component is useful when you need the user to pick one option from a list of multiple
 * options.
 * @param id - string
 * @param label - button label
 * @param size - (optional) the default size is `small`
 * @param isSelected - boolean (optional) `selected` state is passed through this prop
 * @param error - boolean (optional) to represent error state
 * @param handleChange - handler that will be called when the user clicks on the button
 * @example
 * ```tsx
 *    <RadioButton
        id='1'
        label='Radio button'
        value='Radio button'
        isSelected={true}
        handleChange={handleRadioChange}
      />
 * ```
 **/
export const RadioButton: React.FC<RadioButtonProps> = props => {
  const {
    handleChange,
    id,
    label,
    value,
    isSelected = false,
    error = false,
    size = 'small',
  } = props;

  const textColor = error ? 'text-errorLight dark:text-errorDark' : 'text-black dark:text-white';
  const inputColor = error
    ? 'after:bg-errorLight dark:after:bg-errorDark'
    : 'after:bg-secondaryLight dark:after:bg-secondaryDark';
  const buttonSize = size === 'small' ? 'w-4 h-4' : 'w-6 h-6';
  const pseudoCircleSize = size === 'small' ? 'after:w-2 after:h-2' : 'after:w-4 after:h-4 ';

  const instanceStyles = `
    ${baseStyles}
  `;

  const instanceButtonStyles = `
  ${baseButtonStyles}
  border(& ${inputColor})
`;

  return (
    <div className={instanceStyles}>
      <input
        id={id}
        type="radio"
        value={value}
        className="hidden"
        checked={isSelected}
        aria-labelledby={value}
        onChange={handleChange}
      />
      <label htmlFor={id} className={`flex items-center cursor-pointer text-sm ${textColor}`}>
        <span
          className={
            isSelected
              ? `${buttonSize} ${instanceButtonStyles} after:block ${inputColor} after:rounded-full ${pseudoCircleSize}`
              : `${buttonSize} ${instanceButtonStyles} after:hidden`
          }
        ></span>
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
