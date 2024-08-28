import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Stack, { StackProps } from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

Stack.displayName = 'Stack';

const meta: Meta<StackProps> = {
  title: 'DSCore/Stack/Stack',
  component: Stack,

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

export const Default: Story = {
  args: {
    children: (
      <React.Fragment>
        <Text>item 1</Text>
        <Text>item 2</Text>
        <Text>item 3</Text>
        <Text>item 4</Text>
      </React.Fragment>
    ),
  },
};

export const StackWithDirection: Story = {
  args: {
    children: (
      <React.Fragment>
        <Text>item 1</Text>
        <Text>item 2</Text>
        <Text>item 3</Text>
        <Text>item 4</Text>
      </React.Fragment>
    ),
    direction: 'row',
    spacing: 'gap-x-6',
  },
};

export const StackWithSpacing: Story = {
  args: {
    children: (
      <React.Fragment>
        <Text>item 1</Text>
        <Text>item 2</Text>
        <Text>item 3</Text>
        <Text>item 4</Text>
      </React.Fragment>
    ),
    direction: 'column',
    spacing: 'gap-y-6',
  },
};

export default meta;
