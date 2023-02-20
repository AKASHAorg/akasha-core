import React from 'react';
import Stack from './index';

export default {
  title: 'Stack/Stack',
  component: Stack,
};

const Template = args => (
  <Stack {...args}>
    <div>Element 1</div>
    <div>Element 2</div>
    <div>Element 3</div>
    <div>Element 4</div>
  </Stack>
);

export const BasicStack = Template.bind({});
BasicStack.args = {};

export const VerticalStack = Template.bind({});
VerticalStack.args = {
  direction: 'column',
};
