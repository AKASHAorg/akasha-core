import type { Meta, StoryObj } from '@storybook/react';
import Text, { TextProps } from '@akashaorg/design-system-core/lib/components/Text';

const meta: Meta<TextProps> = {
  title: 'DSCore/Text/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'subtitle1',
        'subtitle2',
        'body1',
        'body2',
        'label',
        'footnotes1',
        'footnotes2',
        'button-sm',
        'button-md',
        'button-lg',
      ],
    },
    selectable: { control: 'boolean' },
    customStyle: { control: 'text' },
    lineClamp: { control: 'number' },
    align: { control: 'select', options: ['start', 'center', 'end'] },
  },
};

type Story = StoryObj<TextProps>;

export const Default: Story = {
  args: { children: 'Almost before we knew it, we had left the ground' },
};

export const TextWithLineClamp: Story = {
  args: {
    children: 'Almost before we knew it, we had left the ground',
    lineClamp: 2,
    customStyle: 'w-32',
  },
};

export const UnselectableText: Story = {
  args: { children: 'Almost before we knew it, we had left the ground', selectable: false },
};

export default meta;
