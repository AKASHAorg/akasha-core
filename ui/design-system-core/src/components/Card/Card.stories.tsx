import React from 'react';

import Card, { CardProps } from './index';

export default {
  title: 'Cards/Card',
  component: Card,
};

const Template = (args: CardProps) => <Card {...args} />;

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
