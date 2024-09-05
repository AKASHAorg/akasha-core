import type { Meta, StoryObj } from '@storybook/react';

import MarkdownCard, {
  MarkdownCardProps,
} from '@akashaorg/design-system-core/lib/components/MarkdownCard';

MarkdownCard.displayName = 'MarkdownCard';

const meta: Meta<MarkdownCardProps> = {
  title: 'DSCore/Cards/MarkdownCard',
  component: MarkdownCard,
  argTypes: {
    mdText: { control: 'text' },
    hasWrapper: { control: 'boolean' },
  },
};

type Story = StoryObj<MarkdownCardProps>;

export const Default: Story = { args: { mdText: '**Hello World**' } };

export const MarkdownCardWithWrapper: Story = {
  args: { mdText: '**Hello World**', hasWrapper: true },
};

export default meta;
