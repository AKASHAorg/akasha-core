import React from 'react';

import { Card } from './index';

export default {
  title: 'Cards/Card',
  component: Card,
};

const Template = args => <Card {...args} />;

const CardContents = (
  <>
    <div>Card content</div>
  </>
);

export const Default = Template.bind({});
Default.args = {
  margin: 'auto',
  radius: 8,
  children: CardContents,
};
