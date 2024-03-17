import type { Meta, StoryObj } from '@storybook/react';

import Divider, { DividerProps } from '@akashaorg/design-system-core/lib/components/Divider';

const meta: Meta<DividerProps> = {
  title: 'DSCore/Dividers/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    customStyle: { control: 'text' },
  },
};

type Story = StoryObj<DividerProps>;

export const Default: Story = {};

export default meta;
