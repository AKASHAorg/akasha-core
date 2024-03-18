import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BasicPopover, {
  BasicPopoverProps,
} from '@akashaorg/design-system-core/lib/components/BasicPopover';

const meta: Meta<BasicPopoverProps> = {
  title: 'DSCore/Popovers/BasicPopover',
  component: BasicPopover,
  tags: ['autodocs'],
  argTypes: {
    gap: { control: 'text' },
    target: { control: 'object' },
    overflow: { control: 'text' },
    closePopover: { action: 'popover closed' },
  },
};

type Story = StoryObj<BasicPopoverProps>;

const targetNode = document.createElement('div');
document.body.appendChild(targetNode);

const Contents = (
  <React.Fragment>
    <div>Popover content</div>
    <div>Popover content</div>
    <div>Popover content</div>
  </React.Fragment>
);

const baseArgs: Story = {
  args: {
    target: targetNode,
    children: Contents,
  },
};

export const Default: Story = { args: { ...baseArgs.args } };

export const BasicPopoverWithSpecifiedGap: Story = { args: { ...baseArgs.args, gap: '-0.313rem' } };

export default meta;
