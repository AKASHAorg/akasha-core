import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import BasicCardBox, { BasicCardBoxProps } from '.';

const meta: Meta<BasicCardBoxProps> = {
  title: 'Cards/BasicCardBox',
  component: BasicCardBox,
};

export default meta;
type Story = StoryObj<BasicCardBoxProps>;

const CardContents = (
  <>
    <div>Card content</div>
    <div>Card content</div>
    <div>Card content</div>
  </>
);

export const BaseBasicCardBox: Story = {
  render: () => <BasicCardBox customStyle="w-[25%]">{CardContents}</BasicCardBox>,
};

export const BasicCardBoxWithElevation: Story = {
  render: () => (
    <BasicCardBox elevation="md" customStyle="w-[25%]">
      {CardContents}
    </BasicCardBox>
  ),
};

export const BasicCardBoxWithDashedBorder: Story = {
  render: () => (
    <BasicCardBox dashedBorder={true} customStyle="w-[25%]">
      {CardContents}
    </BasicCardBox>
  ),
};
