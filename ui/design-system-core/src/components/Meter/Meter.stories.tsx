import React from 'react';

import Meter, { MeterProps } from './index';

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
