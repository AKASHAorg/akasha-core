import React from 'react';

import Meter from './index';
import { MeterProps } from './types';

export default {
  title: 'Meter/Meter',
  component: Meter,
};

const Template = (args: MeterProps) => <Meter {...args} />;

export const BaseMeter = Template.bind({});
BaseMeter.args = {
  size: 400,
  value: 60,
  thickness: 48,
};

export const HorizontalBarMeter = Template.bind({});
HorizontalBarMeter.args = {
  size: 400,
  value: 60,
  thickness: 48,
  type: 'bar',
};

export const VerticalBarMeter = Template.bind({});
VerticalBarMeter.args = {
  size: 400,
  value: 90,
  thickness: 48,
  type: 'bar',
  direction: 'vertical',
};
