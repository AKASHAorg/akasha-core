import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip, { TooltipProps } from '@akashaorg/design-system-core/lib/components/Tooltip';

const meta: Meta<TooltipProps> = {
  title: 'DSCore/Tooltip/Tooltip',
  component: Tooltip,
  argTypes: {
    arrow: { control: 'boolean' },
    open: { control: 'boolean' },
    centerArrowToReference: { control: 'boolean' },
    placement: { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
  },
};

type Story = StoryObj<TooltipProps>;

export const Default: Story = {
  args: {
    content: 'some useful tip',
    placement: 'top',
    arrow: false,
    children: <Text>Hover to learn more</Text>,
    customStyle: 'm-16',
  },
};

export const TooltipWithArrow: Story = {
  args: {
    content: 'some useful tip',
    placement: 'top',
    children: <Text>Hover to learn more</Text>,
    customStyle: 'm-16',
    arrow: true,
  },
};

export const ControlledTooltip: Story = {
  args: {
    content: 'some useful tip',
    placement: 'top',
    children: <Text>Hover to learn more</Text>,
    customStyle: 'm-16',
    arrow: true,
    open: true,
  },
};

export const CenterArrowToReferenceTooltip: Story = {
  args: {
    arrow: false,
    children: <Text>Hover to learn more</Text>,
    customStyle: 'm-16',
    centerArrowToReference: true,
    placement: 'bottom',
    content: (
      <Text>
        I am a tooltip...
        <br />
        ...more content
        <br />
        ...more content
        <br />
        ...more content
        <br />
        ...more content
        <br />
        ...more content
        <br />
        ...more content
        <br />
        ...more content
        <br />
        ...more content
        <br />
        ...more content
        <br />
        ...more content
        <br />
        ...more content
        <br />
        ...more content
        <br />
        ...more content
      </Text>
    ),
  },
};

export default meta;
