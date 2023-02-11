import React from 'react';

import RadioButton from './';

export default {
  title: 'Buttons/RadioButton',
  component: RadioButton,
};

const Template = args => {
  const [selectedButton, setSelectedButton] = React.useState('COD');

  const changeHandler = e => {
    setSelectedButton(e.target.value);
  };
  const args1 = {
    label: 'Radio button 1',
    value: 'Radio button 1',
    id: '1',
    isSelected: selectedButton === 'Radio button 1',
    handleChange: changeHandler,
  };
  const args2 = {
    label: 'Radio button 2',
    value: 'Radio button 2',
    id: '2',
    isSelected: selectedButton === 'Radio button 2',
    handleChange: changeHandler,
  };
  const args3 = {
    label: 'Radio button error',
    value: 'Radio button error',
    id: '3',
    isSelected: selectedButton === 'Radio button error',
    error: true,
    handleChange: changeHandler,
  };
  const args4 = {
    label: 'Radio button 4',
    value: 'Radio button 4',
    id: '4',
    isSelected: selectedButton === 'Radio button 4',
    error: true,
    size: 'large',
    handleChange: changeHandler,
  };
  return (
    <div>
      <RadioButton {...args1} />
      <RadioButton {...args2} />
      <RadioButton {...args3} />
      <RadioButton {...args4} />
    </div>
  );
};

export const Default = Template.bind({});
