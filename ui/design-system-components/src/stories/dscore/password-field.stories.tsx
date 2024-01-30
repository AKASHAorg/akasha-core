import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import PasswordField, {
  PasswordFieldProps,
} from '@akashaorg/design-system-core/lib/components/PasswordField';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const meta: Meta<PasswordFieldProps> = {
  title: 'DSCore/Fields/PasswordField',
  component: PasswordField,
};

export default meta;
type Story = StoryObj<PasswordFieldProps>;

const variants = [
  {
    strengthLevel: 0,
  },
  {
    strengthLevel: 1,
  },
  {
    strengthLevel: 2,
  },
  {
    strengthLevel: 3,
  },
  {
    strengthLevel: 4,
  },
];

export const PasswordFieldVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-2" customStyle="w-[25%]">
      {variants.map((variant, idx) => (
        <PasswordField
          key={idx}
          id={String(variant.strengthLevel + idx)}
          {...variant}
          placeholderLabel="Enter your password"
        />
      ))}
    </Stack>
  ),
};
