import React from 'react';

import { Toggle } from './index';

export default {
  title: 'Toggle',
  component: Toggle,
};

const Template = args => <Toggle {...args} />;

export const Default = Template.bind({});
Default.args = {
  margin: 'auto',
};
