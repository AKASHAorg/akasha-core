import type { Meta, StoryObj } from '@storybook/react';

import AutoComplete, {
  AutoCompleteProps,
} from '@akashaorg/design-system-core/lib/components/AutoComplete';

const meta: Meta<AutoCompleteProps> = {
  title: 'DSCore/Fields/AutoComplete',
  component: AutoComplete,

  argTypes: {
    options: { control: 'object' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    value: { control: 'text' },
    customStyle: { control: 'text' },
    multiple: { control: 'boolean' },
    separators: { control: 'select', options: ['Space', 'Comma', 'Enter'] },
    tags: { control: 'object' },
    onChange: { action: 'field changed' },
    onSelected: { action: 'option selected' },
  },
};

type Story = StoryObj<AutoCompleteProps>;

export const Default: Story = {
  args: {
    options: ['AKASHA', 'AKIRA', 'Travel', 'Cooking', 'Ethereum', 'Finance'],
    customStyle: 'w-[50%]',
  },
};

export const AutoCompleteDisabled: Story = {
  args: {
    options: ['AKASHA', 'AKIRA', 'Travel', 'Cooking', 'Ethereum', 'Finance'],
    customStyle: 'w-[50%]',
    disabled: true,
  },
};

export default meta;
