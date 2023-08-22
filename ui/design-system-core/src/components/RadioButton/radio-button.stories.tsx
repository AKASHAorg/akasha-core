import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import RadioButton, { RadioButtonProps } from '.';
import Stack from '../Stack';

const meta: Meta<RadioButtonProps> = {
  title: 'Buttons/RadioButton',
  component: RadioButton,
};

export default meta;
type Story = StoryObj<RadioButtonProps>;

const variants: Omit<RadioButtonProps, 'handleChange'>[] = [
  {
    label: 'Radio button 1',
    value: 'Radio button 1',
    id: '1',
  },
  {
    label: 'Radio button error',
    value: 'Radio button error',
    id: '2',
    error: true,
  },
  {
    label: 'Radio button 3',
    value: 'Radio button 3',
    id: '3',
    size: 'large',
  },
];

const Component = () => {
  const [selectedButton, setSelectedButton] = React.useState('');

  const changeHandler = e => {
    setSelectedButton(e.target.value);
  };

  return (
    <Stack direction="column" spacing="gap-y-2">
      {variants.map((variant, idx) => (
        <RadioButton
          key={idx}
          {...variant}
          isSelected={selectedButton === variant.value}
          handleChange={changeHandler}
        />
      ))}
    </Stack>
  );
};

export const RadioButtonVariants: Story = {
  render: () => <Component />,
};
