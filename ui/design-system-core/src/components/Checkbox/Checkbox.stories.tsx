import React from 'react';
import Checkbox from '.';

export default {
  title: 'Buttons/Checkbox',
  component: Checkbox,
};

const checkboxes = [
  { label: 'Checkbox 1' },
  { label: 'Checkbox 2' },
  { label: 'Checkbox error', error: true },
];
const name = 'checkboxes';

const Template = () => {
  const [checkedState, setCheckedState] = React.useState(Array(checkboxes.length).fill(false));

  const changeHandler = pos => {
    const updatedCheckedState = checkedState.map((item, idx) => (idx === pos ? !item : item));
    setCheckedState(updatedCheckedState);
    console.log('checkedState', checkedState);
  };

  return (
    <>
      {checkboxes.map(({ label, error = false }, index) => (
        <Checkbox
          key={index}
          label={label}
          name={name}
          value={label}
          id={index.toString()}
          isSelected={checkedState[index]}
          error={error}
          handleChange={() => changeHandler(index)}
        />
      ))}
    </>
  );
};
export const Default = Template.bind({});
// Default.args = {
//   label: 'Checkbox 1',
//   value: 'Checkbox 1',
//   id: '1',
//   name: 'food',
// };
