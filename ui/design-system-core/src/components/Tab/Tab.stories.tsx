import React from 'react';

import Tab, { TabProps } from './index';

export default {
  title: 'Tab/Tab',
  component: Tab,
};

const Template = (args: TabProps) => (
  <Tab labels={args.labels}>
    <div>Content 1</div>
    <div>Content 2</div>
    <div>Content 3</div>
  </Tab>
);

export const DefaultField = Template.bind({});
DefaultField.args = {
  labels: ['Tab 1', 'Tab 2', 'Tab 3'],
};
