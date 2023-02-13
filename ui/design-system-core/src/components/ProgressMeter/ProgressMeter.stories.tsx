import React from 'react';

import ProgressMeter, { ProgressMeterProps } from './index';

export default {
  title: 'ProgressMeter/ProgressMeter',
  component: ProgressMeter,
};

const Template = (args: ProgressMeterProps) => <ProgressMeter {...args} />;

export const BaseProgressMeter = Template.bind({});
BaseProgressMeter.args = {
  size: 400,
  value: 60,
  thickness: 48,
};
