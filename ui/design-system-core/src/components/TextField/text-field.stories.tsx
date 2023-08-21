import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import TextField from './index';
import Stack from '../Stack';
import { TextFieldProps } from './types';

const meta: Meta = {
  title: 'Fields/TextField',
  component: TextField,
};

export default meta;
type Story = StoryObj<TextFieldProps>;

const variants: TextFieldProps[] = [
  {
    type: 'text',
  },
  {
    type: 'multiline',
  },
  {
    type: 'text',
    label: 'Label',
    caption: 'Default Caption',
  },
  {
    type: 'text',
    label: 'Label',
    caption: 'Warning Caption',
    status: 'warning',
  },
  {
    type: 'text',
    label: 'Label',
    caption: 'Error Caption',
    status: 'error',
  },
  {
    type: 'text',
    label: 'Label',
    caption: 'Success Caption',
    status: 'success',
  },
  {
    type: 'text',
    label: 'Disabled Field',
    placeholder: "what's on your mind?...",
    disabled: true,
  },
  {
    type: 'text',
    label: 'Label',
    caption: 'Warning Caption',
    placeholder: "what's on your mind?...",
    status: 'warning',
    iconLeft: 'CheckCircleIcon',
    iconRight: 'CheckCircleIcon',
  },
  {
    type: 'text',
    label: 'Label',
    caption: 'Error Caption',
    placeholder: "what's on your mind?...",
    status: 'error',
    iconLeft: 'CheckCircleIcon',
    iconRight: 'CheckCircleIcon',
  },
  {
    type: 'text',
    label: 'Label',
    caption: 'Success Caption',
    placeholder: "what's on your mind?...",
    status: 'success',
    iconLeft: 'CheckCircleIcon',
    iconRight: 'CheckCircleIcon',
  },
  {
    type: 'text',
    label: 'Disabled Field with Icon',
    placeholder: "what's on your mind?...",
    disabled: true,
    iconLeft: 'CheckCircleIcon',
    iconRight: 'CheckCircleIcon',
  },
];

const Component = () => {
  const [value, setValue] = React.useState('');

  const handleChange = e => {
    setValue(e.currentTarget.value);
  };

  return (
    <Stack direction="column" spacing="gap-y-2" customStyle="w-[25%]">
      {variants.map((variant, idx) => (
        <TextField key={idx} {...variant} value={value} onChange={handleChange} />
      ))}
    </Stack>
  );
};

export const TextFieldVariants: Story = {
  render: () => <Component />,
};
