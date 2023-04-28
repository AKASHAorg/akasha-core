import React from 'react';
import AutoComplete from '.';

export default {
  title: 'Fields/AutoComplete',
  component: AutoComplete,
};

const Template = args => <AutoComplete {...args} />;

export const BaseAutoComplete = Template.bind({});
BaseAutoComplete.args = {
  options: ['AKASHA', 'AKIRA', 'Travel', 'Cooking', 'Ethereum', 'Finance'],
};
