import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import MarkdownCard, {
  MarkdownCardProps,
} from '@akashaorg/design-system-core/lib/components/MarkdownCard';

const meta: Meta<MarkdownCardProps> = {
  title: 'DSCore/Cards/MarkdownCard',
  component: MarkdownCard,
};

export default meta;
type Story = StoryObj<MarkdownCardProps>;

export const BaseMarkdownCard: Story = {
  render: () => <MarkdownCard mdText="**Hello World**" />,
};
