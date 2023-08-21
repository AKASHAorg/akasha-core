import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import AutoComplete, { AutoCompleteProps } from '.';

const meta: Meta<AutoCompleteProps> = {
  title: 'Fields/AutoComplete',
  component: AutoComplete,
};

export default meta;
type Story = StoryObj<AutoCompleteProps>;

const Component = () => {
  const [query, setQuery] = useState('');

  return (
    <AutoComplete
      value={query}
      onChange={setQuery}
      options={['AKASHA', 'AKIRA', 'Travel', 'Cooking', 'Ethereum', 'Finance']}
      customStyle="w-fit"
    />
  );
};

export const BaseAutoComplete: Story = {
  render: () => <Component />,
};
