import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Toggle, { ToggleProps } from '@akashaorg/design-system-core/lib/components/Toggle';

const meta: Meta<ToggleProps> = {
  title: 'DSCore/Buttons/Toggle',
  component: Toggle,
};

export default meta;
type Story = StoryObj<ToggleProps>;

const variants: ToggleProps[] = [
  {
    label: 'small toggle',
  },

  {
    label: 'large toggle',
    size: 'large',
  },
  {
    iconChecked: 'SunIcon',
    iconUnchecked: 'MoonIcon',
  },
  {
    iconChecked: 'SunIcon',
    iconUnchecked: 'MoonIcon',
    label: 'small toggle',
  },
  {
    checked: false,
    size: 'large',
    disabled: true,
  },
  {
    checked: true,
    size: 'large',
    disabled: true,
  },
  {
    checked: true,
    iconChecked: 'SunIcon',
    iconUnchecked: 'MoonIcon',
    disabled: true,
  },
];

const Component = () => {
  const [selected, setSelected] = React.useState(false);

  const handleChange = () => {
    setSelected(!selected);
  };

  return (
    <Stack direction="column" spacing="gap-y-2" customStyle="w-[25%]">
      {variants.map((variant, idx) => (
        <Toggle key={idx} {...variant} checked={selected} onChange={handleChange} />
      ))}
    </Stack>
  );
};

export const ToggleVariants: Story = {
  render: () => <Component />,
};
