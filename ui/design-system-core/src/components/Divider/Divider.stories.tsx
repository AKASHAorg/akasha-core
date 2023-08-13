import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Divider, { DividerProps } from '.';

const meta: Meta<DividerProps> = {
  title: 'Dividers/Divider',
  component: Divider,
};

export default meta;
type Story = StoryObj<DividerProps>;

export const BaseDivider: Story = {
  render: () => <Divider />,
};
