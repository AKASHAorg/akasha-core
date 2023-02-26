import React from 'react';

import EditorMeter, { EditorMeterProps } from './index';

export default {
  title: 'Meter/EditorMeter',
  component: EditorMeter,
};

const Template = (args: EditorMeterProps) => <EditorMeter {...args} />;

export const BaseMeter = Template.bind({});
BaseMeter.args = {
  max: 25,
  value: 22,
};
