import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ScrollTopButton, { ScrollTopButtonProps } from '.';

const meta: Meta<ScrollTopButtonProps> = {
  title: 'Buttons/ScrollTopButton',
  component: ScrollTopButton,
};

export default meta;
type Story = StoryObj<ScrollTopButtonProps>;

export const BaseScrollTopButton: Story = {
  render: () => <ScrollTopButton onClick={() => ({})} />,
};
