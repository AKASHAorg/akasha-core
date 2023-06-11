import React from 'react';

import ScrollTopButton, { ScrollTopButtonProps } from '.';

export default {
  title: 'Buttons/ScrollTopButton',
  component: ScrollTopButton,
};

const Template = (args: ScrollTopButtonProps) => (
  <div>
    <ScrollTopButton {...args} />
  </div>
);

export const BaseScrollTopButton = Template.bind({});
