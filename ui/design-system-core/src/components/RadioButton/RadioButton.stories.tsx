import React from 'react';

import RadioButton from '.';

export default {
  title: 'Buttons/RadioButton',
  component: RadioButton,
};

const Template = args => {
  const { value } = args;
  const [selectedButton, setSelectedButton] = React.useState('');

  const changeHandler = e => {
    setSelectedButton(e.target.value);
  };

  return (
    <RadioButton {...args} isSelected={selectedButton === value} handleChange={changeHandler} />
  );
};
export const Default = Template.bind({});
Default.args = {
  label: 'Radio button 1',
  value: 'Radio button 1',
  id: '1',
};

export const ErrorRadioButton = Template.bind({});
ErrorRadioButton.args = {
  label: 'Radio button error',
  value: 'Radio button error',
  id: '2',
  error: true,
};

export const LargeRadioButton = Template.bind({});
LargeRadioButton.args = {
  label: 'Radio button error',
  value: 'Radio button error',
  id: '2',
  size: 'large',
};
