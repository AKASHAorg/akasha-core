import React, { useState } from 'react';
import AutoComplete from '.';

export default {
  title: 'Fields/AutoComplete',
  component: AutoComplete,
};

const Template = args => {
  const [query, setQuery] = useState('');
  return <AutoComplete value={query} onChange={setQuery} {...args} />;
};

export const BaseAutoComplete = Template.bind({});
BaseAutoComplete.args = {
  options: ['AKASHA', 'AKIRA', 'Travel', 'Cooking', 'Ethereum', 'Finance'],
};
