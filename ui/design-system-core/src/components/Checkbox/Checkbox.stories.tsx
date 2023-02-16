import React from 'react';
import Checkbox from '.';

export default {
  title: 'Buttons/Checkbox',
  component: Checkbox,
};

const checkboxes: any[] = [
  { label: 'Checkbox small' },
  { label: 'Checkbox large', size: 'large' },
  { label: 'Checkbox error', error: true },
  { label: 'Checkbox disabled', disabled: true },
  { label: 'Checkbox indeterminate', indeterminate: true },
  { label: 'Checkbox indeterminate large', size: 'large', indeterminate: true, disabled: true },
];
const name = 'checkboxes';

const Template = () => {
  const [checkedState, setCheckedState] = React.useState(Array(checkboxes.length).fill(false));

  const changeHandler = pos => {
    const updatedCheckedState = checkedState.map((item, idx) => (idx === pos ? !item : item));
    setCheckedState(updatedCheckedState);
  };

  return (
    <>
      {checkboxes.map(
        ({ label, error = false, size = 'small', disabled, indeterminate = false }, index) => (
          <Checkbox
            key={index}
            label={label}
            name={name}
            value={label}
            id={index.toString()}
            isSelected={checkedState[index]}
            error={error}
            isDisabled={disabled}
            indeterminate={indeterminate}
            size={size}
            handleChange={() => changeHandler(index)}
          />
        ),
      )}
    </>
  );
};
export const Default = Template.bind({});
