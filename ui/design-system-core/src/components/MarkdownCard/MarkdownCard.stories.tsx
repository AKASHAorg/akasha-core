import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import MarkdownCard, { MarkdownCardProps } from '.';

const meta: Meta<MarkdownCardProps> = {
  title: 'Cards/MarkdownCard',
  component: MarkdownCard,
};

export default meta;
type Story = StoryObj<MarkdownCardProps>;

export const BaseMarkdownCard: Story = {
  render: () => <MarkdownCard mdText="**Hello World**" />,
};
