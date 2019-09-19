/* eslint-disable import/first */
import { boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';
import RadioButton from './index';

const RadioButtonComponent = () => {
  const [value, selectValue] = useState('value1');

  return (
    <>
      <RadioButton
        checked={value === 'value1'}
        disabled={boolean('Disabled', false)}
        id="radiobutton-1"
        name="radiobutton-1"
        label="Value 1"
        onChange={() => selectValue('value1')}
      />
      <RadioButton
        checked={value === 'value2'}
        disabled={boolean('Disabled', false)}
        id="radiobutton-2"
        name="radiobutton-2"
        label="Value 2"
        onChange={() => selectValue('value2')}
      />
    </>
  );
};

storiesOf('RadioButton', module).add('default', () => <RadioButtonComponent />);
