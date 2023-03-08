import React from 'react';
import Spinner, { ISpinnerProps } from './index';

export default {
  title: 'Spinner/Spinner',
  component: Spinner,
};

const Template = (args: ISpinnerProps) => <Spinner {...args} />;

export const SpinnerSmall = Template.bind({});
SpinnerSmall.args = {
  size: 'sm',
};

export const SpinnerSmallWithColor = Template.bind({});
SpinnerSmallWithColor.args = {
  color: 'green',
};

export const SpinnerLarge = Template.bind({});
SpinnerLarge.args = {
  size: 'lg',
};

export const SpinnerXXLarge = Template.bind({});
SpinnerXXLarge.args = {
  size: 'xxl',
};
