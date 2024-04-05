import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Stack, { StackProps } from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

Stack.displayName = 'Stack';

const meta: Meta<StackProps> = {
  title: 'DSCore/Stack/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['column', 'column-reverse', 'row', 'row-reverse'],
    },
    align: {
      control: 'select',
      options: ['start', 'end', 'center', 'stretch', 'baseline'],
    },
    justify: {
      control: 'select',
      options: ['start', 'end', 'center', 'between', 'around', 'evenly'],
    },
    customStyle: { control: 'text' },
    spacing: { control: 'text' },
    fullWidth: { control: 'boolean' },
    id: { control: 'text' },
  },
};

type Story = StoryObj<StackProps>;

const children = (
  <React.Fragment>
    <Text>item 1</Text>
    <Text>item 2</Text>
    <Text>item 3</Text>
    <Text>item 4</Text>
  </React.Fragment>
);

const baseArgs: Story = {
  args: {
    children,
    direction: 'column',
  },
};

export const Default: Story = { args: { ...baseArgs.args } };

export const StackWithDirection: Story = { args: { ...baseArgs.args, direction: 'row' } };

export const StackWithSpacing: Story = { args: { ...baseArgs.args, spacing: 'gap-y-6' } };

export default meta;
