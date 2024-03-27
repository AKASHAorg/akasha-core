import type { Meta, StoryObj } from '@storybook/react';
import TextLine, { TextLineProps } from '@akashaorg/design-system-core/lib/components/TextLine';

const meta: Meta<TextLineProps> = {
  title: 'DSCore/Lines/TextLine',
  component: TextLine,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    round: { control: 'text' },
    width: { control: 'number' },
    height: { control: 'number' },
    customStyle: { control: 'text' },
    animated: { control: 'boolean' },
  },
};

type Story = StoryObj<TextLineProps>;

export const Default: Story = {};

export const TextLineAnimated: Story = { args: { animated: true } };

export const TextLineWithStraightCorners: Story = { args: { round: null } };

export const TextLineRounded: Story = { args: { width: 50, height: 50, round: 'rounded-full' } };

export const TextLineWithWidth: Story = { args: { width: 50 } };

export const TextLineWithHeight: Story = { args: { height: 50 } };

export default meta;
