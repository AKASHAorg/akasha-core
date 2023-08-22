import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Dropdown, {
  DropdownProps,
  DropdownMenuItemType,
} from '@akashaorg/design-system-core/lib/components/Dropdown';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const meta: Meta<DropdownProps> = {
  title: 'DSCore/Buttons/Dropdown',
  component: Dropdown,
};

export default meta;
type Story = StoryObj<DropdownProps>;

const variants: Omit<DropdownProps, 'selected' | 'setSelected'>[] = [
  {
    name: 'BaseDropdown',
    menuItems: [
      { id: '1', iconName: 'BeakerIcon', title: 'Option 1' },
      { id: '2', iconName: 'ArchiveBoxIcon', title: 'Option 2' },
      { id: '3', iconName: 'ArchiveBoxIcon', title: 'Option 3' },
    ],
  },
  {
    name: 'DropdownOptionsWithoutIcon',
    menuItems: [
      { id: '1', title: 'Option 1' },
      { id: '2', title: 'Option 2' },
    ],
  },
  {
    label: 'Select One',
    menuItems: [
      { id: '1', iconName: 'BeakerIcon', title: 'Option 1' },
      { id: '2', iconName: 'ArchiveBoxIcon', title: 'Option 2' },
    ],
  },
  {
    name: 'DropdownWithPlaceholderLabel',
    placeholderLabel: 'Select an option',
    menuItems: [
      { id: '1', iconName: 'BeakerIcon', title: 'Option 1' },
      { id: '2', iconName: 'ArchiveBoxIcon', title: 'Option 2' },
    ],
  },
];

const Component = () => {
  const [selected, setSelected] = React.useState<DropdownMenuItemType | null>();
  return (
    <Stack spacing="gap-x-2">
      {variants.map((variant, idx) => (
        <Dropdown key={idx} selected={selected} setSelected={setSelected} {...variant} />
      ))}
    </Stack>
  );
};

export const DropdownVariants: Story = {
  render: () => <Component />,
};
