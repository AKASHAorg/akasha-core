import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BasicPopover, {
  BasicPopoverProps,
} from '@akashaorg/design-system-core/lib/components/BasicPopover';

const meta: Meta<BasicPopoverProps> = {
  title: 'DSCore/Popovers/BasicPopover',
  component: BasicPopover,

  argTypes: {
    gap: { control: 'text' },
    target: { control: 'object' },
    overflow: { control: 'text' },
    closePopover: { action: 'popover closed' },
  },
};

type Story = StoryObj<BasicPopoverProps>;

const target = document.createElement('div');
document.body.appendChild(target);

export const Default: Story = {
  args: {
    target,
    children: (
      <React.Fragment>
        <div>Popover content</div>
        <div>Popover content</div>
        <div>Popover content</div>
      </React.Fragment>
    ),
  },
};

export const BasicPopoverWithSpecifiedGap: Story = {
  args: {
    target,
    children: (
      <React.Fragment>
        <div>Popover content</div>
        <div>Popover content</div>
        <div>Popover content</div>
      </React.Fragment>
    ),
    gap: '-0.313rem',
  },
};

export default meta;
