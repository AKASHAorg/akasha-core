import React from 'react';
import { tw } from '@twind/core';
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
  render: () => (
    <div className={tw('w-[25%]')}>
      <BasicCardBox>{CardContents}</BasicCardBox>
    </div>
  ),
};

export const BasicCardBoxWithElevation: Story = {
  render: () => (
    <div className={tw('w-[25%]')}>
      <BasicCardBox elevation="md">{CardContents}</BasicCardBox>
    </div>
  ),
};

export const BasicCardBoxWithDashedBorder: Story = {
  render: () => (
    <div className={tw('w-[25%]')}>
      <BasicCardBox dashedBorder={true}>{CardContents}</BasicCardBox>
    </div>
  ),
};
