import type { Meta, StoryObj } from '@storybook/react';

import MarkdownCard, {
  MarkdownCardProps,
} from '@akashaorg/design-system-core/lib/components/MarkdownCard';

const meta: Meta<MarkdownCardProps> = {
  title: 'DSCore/Cards/MarkdownCard',
  component: MarkdownCard,
  tags: ['autodocs'],
  argTypes: {
    mdText: { control: 'text' },
    hasWrapper: { control: 'boolean' },
  },
};

type Story = StoryObj<MarkdownCardProps>;

const baseArgs: Story = {
  args: {
    mdText: '**Hello World**',
  },
};

export const Default: Story = { args: { ...baseArgs.args } };

export const MarkdownCardWithWrapper: Story = { args: { ...baseArgs.args, hasWrapper: true } };

export default meta;
