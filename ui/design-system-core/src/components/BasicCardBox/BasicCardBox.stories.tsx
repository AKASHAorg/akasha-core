import React from 'react';
import { tw } from '@twind/core';

import BasicCardBox, { IBasicCardBox } from '.';

export default {
  title: 'Cards/BasicCardBox',
  component: BasicCardBox,
};

const Template = (args: IBasicCardBox) => (
  <div className={tw('w-[50%]')}>
    <BasicCardBox {...args} />
  </div>
);

const CardContents = (
  <>
    <div>Card content</div>
    <div>Card content</div>
    <div>Card content</div>
  </>
);

export const BasicCard = Template.bind({});

BasicCard.args = {
  children: CardContents,
};

export const BasicCardWithElevation = Template.bind({});

BasicCardWithElevation.args = {
  children: CardContents,
  elevation: 'md',
};

export const BasicCardWithDashedBorder = Template.bind({});

BasicCardWithDashedBorder.args = {
  children: CardContents,
  dashedBorder: true,
};

export const BasicCardWithoutBorder = Template.bind({});

BasicCardWithoutBorder.args = {
  children: CardContents,
  noBorder: true,
};
