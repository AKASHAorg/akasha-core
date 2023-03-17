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
  const textColorIndeterminate = isDisabled
    ? 'text-black dark:text-grey4'
    : 'text-black dark:text-white';
  const inputColor = error ? 'orange-400' : isDisabled ? 'grey4' : 'secondary-light';
  const checkmarkColor = error ? 'white dark:black' : isDisabled ? 'grey6 dark:grey5' : 'white';
  const minusMarkColor = isDisabled ? 'bg-grey6 dark:bg-grey5' : 'bg-grey4 dark:bg-white';
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

  const minusMarkSizes =
    size === 'small'
      ? 'after:w-2.5 after:h-[2px] after:-ml-[3px] after:mt-2.5'
      : 'after:w-3.5 after:h-[1.5px] after:-ml-[3px] after:mt-2.5';

  const instanceLabelStyle = apply`
  ${baseLabelStyles}
  ${indeterminate ? textColorIndeterminate : textColor}
  `;

  const instancePseudoCheckboxStyle = apply`
  ${basePseudoCheckboxStyles}
  ${checkboxSizes}
  ${tickMarkSizes}
  before:border(2 ${inputColor})
  after:border(l-[1px] ${checkmarkColor}) after:border(b-[1px] ${checkmarkColor}) after:-rotate-45
  ${bgColor}
  `;

  const minusMarkStyles = apply`
  ${minusMarkSizes}
  after:${minusMarkColor}
  `;

  const instanceInderterminateCheckboxStyle = apply`
  ${basePseudoCheckboxStyles}
  ${checkboxSizes}
  ${minusMarkStyles}
  before:border(2 ${isDisabled ? 'grey4' : 'secondary-dark'})
  before:${isDisabled ? 'bg-grey4' : 'bg-secondary-dark'}
  invisible w-4 h-4 relative
  `;

  const selectedPseudoCheckboxStyle = apply`
    ${instancePseudoCheckboxStyle}
    invisible w-4 h-4 relative
    `;

  const unselectedPseudoCheckboxStyle = apply`
    ${instancePseudoCheckboxStyle}
    after:content-none invisible w-4 h-4 relative
    `;

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
            ? instanceInderterminateCheckboxStyle
            : isSelected
            ? selectedPseudoCheckboxStyle
            : unselectedPseudoCheckboxStyle,
        )}
      />
      <label htmlFor={value} className={tw(instanceLabelStyle)}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
