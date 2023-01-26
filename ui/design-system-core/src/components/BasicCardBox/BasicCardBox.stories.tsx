import React from 'react';

import BasicCardBox from '.';

import { IBasicCardBox } from '../../interfaces/basicCardBox.interface';

export default {
  title: 'Cards/BasicCardBox',
  component: BasicCardBox,
};

const Template = (args: IBasicCardBox) => (
  <div style={{ width: '50%' }}>
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

export const BasicCardWithRedDashedBorder = Template.bind({});

BasicCardWithRedDashedBorder.args = {
  children: CardContents,
  dashedBorder: true,
  redDashedBorder: true,
};

export const BasicCardWithDarkBorder = Template.bind({});

BasicCardWithDarkBorder.args = {
  children: CardContents,
  darkBorder: true,
};

export const BasicCardWithoutBorder = Template.bind({});

BasicCardWithoutBorder.args = {
  children: CardContents,
  noBorder: true,
};

export const BasicCardSelected = Template.bind({});

BasicCardSelected.args = {
  children: CardContents,
  isSelected: true,
};
