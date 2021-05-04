import React from 'react';
import { Grommet } from 'grommet';

import TextInputField, { ITextInputFieldProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Fields/TextInputField',
  component: TextInputField,
  argTypes: {
    onChange: { action: 'field changed' },
  },
};

const Template = (args: ITextInputFieldProps) => (
  <Grommet theme={lightTheme}>
    <TextInputField {...args} />
  </Grommet>
);

const TemplateAlt = (args: ITextInputFieldProps) => {
  const [value, setValue] = React.useState('');
  return (
    <Grommet theme={lightTheme}>
      <TextInputField {...args} value={value} onChange={e => setValue(e.currentTarget.value)} />
    </Grommet>
  );
};

export const BaseTextInputField = Template.bind({});

BaseTextInputField.args = {
  id: 'text-input',
  label: 'text input field',
  name: 'text-input',
  placeholder: 'Enter a value',
};

export const TextInputFieldWithValue = Template.bind({});

TextInputFieldWithValue.args = {
  id: 'text-input',
  label: 'text input field',
  name: 'text-input',
  value: 'I have some value now',
};

export const TextInputFieldWithOnchange = TemplateAlt.bind({});

TextInputFieldWithOnchange.args = {
  id: 'text-input',
  label: 'text input field',
  name: 'text-input',
  placeholder: 'This is shown when there is no value',
};
