/* eslint-disable import/first */
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import CheckBox from './';

const CheckBoxComponent = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <CheckBox
      checked={checked}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setChecked(event.target.checked)}
      disabled={boolean('Disabled', false)}
      id={text('id', 'checkbox-id')}
      indeterminate={boolean('Indeterminate', false)}
      label={text('Label', 'Choice')}
      name={text('Name', 'name')}
      toggle={boolean('Toggle', false)}
      reverse={boolean('Reverse', false)}
    />
  );
};

storiesOf('CheckBox', module).add('default', () => <CheckBoxComponent />);
