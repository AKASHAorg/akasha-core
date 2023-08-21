import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import BasicPopover, {
  BasicPopoverProps,
} from '@akashaorg/design-system-core/lib/components/BasicPopover';

const meta: Meta<BasicPopoverProps> = {
  title: 'DSCore/Popovers/BasicPopover',
  component: BasicPopover,
};

export default meta;
type Story = StoryObj<BasicPopoverProps>;

const targetNode = document.createElement('div');
document.body.appendChild(targetNode);

const Contents = (
  <>
    <div>Popover content</div>
    <div>Popover content</div>
    <div>Popover content</div>
  </>
);

export const BaseBasicPopover: Story = {
  render: () => (
    <BasicPopover target={targetNode} closePopover={() => ({})}>
      {Contents}
    </BasicPopover>
  ),
};

export const BasicPopoverWithSpecifiedGap: Story = {
  render: () => (
    <BasicPopover target={targetNode} gap="-0.313rem" closePopover={() => ({})}>
      {Contents}
    </BasicPopover>
  ),
};
