import * as React from 'react';
import { tw, apply } from '@twind/core';

export type CheckboxSize = 'small' | 'large';

export interface iCheckboxProps {
  id: string;
  label: string;
  value: string;
  name: string;
  size?: CheckboxSize;
  //status
  indeterminate?: boolean;
  error?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  //handler
  handleChange?: () => void;
}

const baseLabelStyles = apply`
relative inline-block pl-2
`;

const basePseudoCheckboxStyles = `
before:absolute after:absolute before:visible after:visible
after:content-[''] before:content-['']
before:inline-block after:inline-block
before:rounded-md
after:-rotate-45
`;

const Checkbox: React.FC<iCheckboxProps> = ({
  id,
  label,
  value,
  name,
  size = 'small',
  isSelected = false,
  error = false,
  indeterminate = false,
  isDisabled = false,
  handleChange,
}) => {
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (indeterminate === true) {
      checkboxRef.current.indeterminate = true;
      checkboxRef.current.checked = false;
    }
  }, [indeterminate]);

  const textColor = error
    ? 'text-error-light dark:text-error-dark hover:text-error-light'
    : isDisabled
    ? 'text-grey4 hover:text-grey4'
    : 'text(black dark:white) hover:text-secondary-light dark:hover:text-secondary-dark';
  const inputColor = error ? 'orange-400' : isDisabled ? 'grey4' : 'secondary-light';
  const checkmarkColor = error ? 'white dark:black' : isDisabled ? 'grey6' : 'white';
  const bgColor = isDisabled
    ? 'before:bg-grey4'
    : isSelected
    ? error
      ? 'before:bg-error-dark'
      : 'before:bg-secondary-light dark:before:bg-secondary-dark'
    : 'before:bg-transparent before:disabled:opacity-75 disabled:before:bg-grey4';
  const checkboxSizes =
    size === 'small'
      ? 'before:w-5 before:h-5 before:-ml-2 before:mt-px'
      : 'before:w-6 before:h-6 before:-ml-2 before:mt-0';
  const tickMarkSizes =
    size === 'small'
      ? 'after:w-2.5 after:h-1.5 after:-ml-0.5 after:mt-1.5'
      : 'after:w-4 after:h-2 after:-ml-1 after:mt-1.5';

  const instanceLabelStyles = apply`
  ${baseLabelStyles}
  ${textColor}
  `;

  const instancePseudoCheckboxStyles = apply`
  ${basePseudoCheckboxStyles}
   ${checkboxSizes}
   ${tickMarkSizes}
  before:border(2 ${inputColor})
  after:border(l-2 ${checkmarkColor}) after:border(b-2 ${checkmarkColor})
  ${bgColor}
  `;

  const selectedPseudoCheckboxStyles = apply`
    ${instancePseudoCheckboxStyles}
    invisible w-4 h-4 relative
    `;

  const unselectedPseudoCheckboxStyles = apply`
    ${instancePseudoCheckboxStyles}
    after:content-none invisible w-4 h-4 relative
    `;

  React.useEffect(() => {
    console.log(indeterminate);
  }, [indeterminate]);

  return (
    <div className={tw('leading-6 my-2 hover:text-secondary-light dark:hover:text-secondary-dark')}>
      <input
        ref={checkboxRef}
        type="checkbox"
        id={id}
        name={name}
        value={value}
        aria-labelledby={value}
        checked={isSelected}
        onChange={handleChange}
        className={tw(
          indeterminate
            ? 'w-6 h-6 bg-grey4 text-grey6'
            : isSelected
            ? selectedPseudoCheckboxStyles
            : unselectedPseudoCheckboxStyles,
        )}
      />
      <label htmlFor={value} className={tw(instanceLabelStyles)}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
