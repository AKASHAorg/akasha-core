import React from 'react';

import Topbar from './';

export default {
  title: 'Topbar',
  component: Topbar,
};

const Template = args => <Topbar {...args} />;

export const Default = Template.bind({});
