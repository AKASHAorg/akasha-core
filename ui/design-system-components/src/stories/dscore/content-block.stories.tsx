import type { Meta, StoryObj } from '@storybook/react';
import ContentBlock, {
  ContentBlockProps,
} from '@akashaorg/design-system-core/lib/components/ContentBlock';

const meta: Meta<ContentBlockProps> = {
  title: 'DSCore/Blocks/ContentBlock',
  component: ContentBlock,
  tags: ['autodocs'],
  argTypes: {
    blockTitle: { control: 'text' },
    blockVariant: { control: 'text' },
    showDivider: { control: 'boolean' },
  },
};

type Story = StoryObj<ContentBlockProps>;

const baseArgs: Story = {
  args: {
    blockTitle: 'Content Block',
  },
};

export const Default: Story = { args: { ...baseArgs.args } };

export const ContentBlockWithoutDivider: Story = { args: { ...baseArgs.args, showDivider: false } };

export default meta;
