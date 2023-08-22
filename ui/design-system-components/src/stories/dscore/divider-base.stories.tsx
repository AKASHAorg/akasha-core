import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Divider, { DividerProps } from '@akashaorg/design-system-core/lib/components/Divider';

const meta: Meta<DividerProps> = {
  title: 'DSCore/Dividers/Divider',
  component: Divider,
};

export default meta;
type Story = StoryObj<DividerProps>;

export const BaseDivider: Story = {
  render: () => <Divider />,
};
