import React from 'react';

import BasicPopover from '.';

import { IBasicPopover } from '../../interfaces/basicpopover.interface';

export default {
  title: 'Popovers/BasicPopover',
  component: BasicPopover,
  decorators: [],
};

const Template = (args: IBasicPopover) => (
  <BasicPopover {...args}>
    <div>
      <div onClick={args.closePopover}>text line 1</div>
      <div onClick={args.closePopover}>text line 2</div>
    </div>
  </BasicPopover>
);

const targetNode = document.createElement('div');
document.body.appendChild(targetNode);

export const BaseBasicPopover = Template.bind({});

BaseBasicPopover.args = {
  target: targetNode,
};

export const BasicPopoverWithGap = Template.bind({});

BasicPopoverWithGap.args = {
  target: targetNode,
  gap: '-0.313rem',
};
