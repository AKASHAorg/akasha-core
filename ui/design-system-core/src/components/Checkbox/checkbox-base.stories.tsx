import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Checkbox, { CheckboxProps, CheckboxSize } from '.';
import Stack from '../Stack';

const meta: Meta<CheckboxProps> = {
  title: 'Buttons/Checkbox',
  component: Checkbox,
};

export default meta;
type Story = StoryObj<CheckboxProps>;

const checkboxes = [
  { label: 'Checkbox small' },
  { label: 'Checkbox large', size: 'large' },
  { label: 'Checkbox error', error: true },
  { label: 'Checkbox disabled', disabled: true },
  { label: 'Checkbox indeterminate', indeterminate: true },
  {
    label: 'Checkbox indeterminate disabled large',
    size: 'large',
    indeterminate: true,
    disabled: true,
  },
];
const name = 'checkboxes';

const Component = () => {
  const [checkedState, setCheckedState] = useState(Array(checkboxes.length).fill(false));

  const changeHandler = pos => {
    const updatedCheckedState = checkedState.map((item, idx) => (idx === pos ? !item : item));
    setCheckedState(updatedCheckedState);
  };

  return (
    <Stack direction="column" spacing="gap-y-2">
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
            size={size as CheckboxSize}
            handleChange={() => changeHandler(index)}
          />
        ),
      )}
    </Stack>
  );
};

export const CheckboxVariants: Story = {
  render: () => <Component />,
};
