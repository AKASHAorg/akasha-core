import * as React from 'react';
import { tw, apply } from '@twind/core';

export interface iCheckboxProps {
  id: string;
  label: string;
  value: string;
  name: string;
  size?: boolean;
  //status
  indeterminate?: boolean;
  error?: boolean;
  isSelected?: boolean;
  //handler
  handleChange?: () => void;
}

const baseStyles = apply`
  flex items-center
  space-x-2 mb-2
`;

const baseButtonStyles = apply`
  inline-block mr-4 ml-0 p-0 rounded-sm
  flex-no-shrink after:content-[''] after:absolute
`;
const baseLabelStyles = apply`
relative inline-block pl-2
`;
const normalLabelStyles = apply`
${baseLabelStyles}
after:hidden
`;

const basePseudoCheckboxStyles = `
before:absolute after:absolute before:visible after:visible
after:content-[''] before:content-['']
before:inline-block after:inline-block
before:w-6 before:h-6 before:-ml-2 before:mt-0 before:rounded-md
after:w-4 after:h-2 after:-rotate-45 after:-ml-1 after:mt-1.5
`;

const checkMarkstyles = `

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
  handleChange,
}) => {
  const textColor = error
    ? 'text-error-dark'
    : 'text(black dark:white) hover:text-secondary-light dark:hover:text-secondary-dark';
  const inputColor = error ? 'orange-400' : 'secondary-light';
  const checkmarkColor = error ? 'black' : 'white';
  const bgColor = error
    ? 'before:bg-error-dark'
    : 'before:bg-secondary-light dark:before:bg-secondary-dark';
  const buttonSize = size === 'small' ? 'w-4 h-4' : 'w-6 h-6';
  const pseudoCheckboxSize =
    size === 'small'
      ? 'after:w-4 after:h-2 border(l-2 secondary-light) border(b-2 secondary-light) rotate-45 pl-2 pt-2'
      : 'after:w-4 after:h-4 after:mt-[3px] after:ml-[3px]';

  const instanceLabelStyles = apply`
  ${baseLabelStyles}
  ${textColor}
  `;

  console.log(checkmarkColor);

  const instancePseudoCheckboxStyles = apply`
  ${basePseudoCheckboxStyles}
  before:border(2 ${inputColor})
  after:border(l-2 ${checkmarkColor}) after:border(b-2 ${checkmarkColor})
  ${bgColor}
  `;

  React.useEffect(() => {
    console.log(isSelected);
  }, [isSelected]);
  return (
    <div className={tw('leading-6 my-2 hover:text-secondary-light dark:hover:text-secondary-dark')}>
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        aria-labelledby={value}
        checked={isSelected}
        onChange={handleChange}
        className={tw(
          isSelected
            ? instancePseudoCheckboxStyles + ' invisible z-[999] w-4 h-4 relative'
            : `${instancePseudoCheckboxStyles} after:content-none invisible z-[999] w-4 h-4 relative`,
        )}
      />
      <label htmlFor={value} className={tw(instanceLabelStyles)}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
