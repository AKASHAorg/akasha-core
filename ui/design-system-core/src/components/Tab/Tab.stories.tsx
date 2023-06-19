import React, { useState } from 'react';

import Tab, { TabProps } from './index';

export default {
  title: 'Tab/Tab',
  component: Tab,
};

const Template = (args: TabProps) => {
  const [value, setValue] = useState(0);
  <Tab value={value} onChange={setValue} labels={args.labels}>
    <div>Content 1</div>
    <div>Content 2</div>
    <div>Content 3</div>
  </Tab>;
};

export const DefaultTab = Template.bind({});
DefaultTab.args = {
  labels: ['Tab 1', 'Tab 2', 'Tab 3'],
};
