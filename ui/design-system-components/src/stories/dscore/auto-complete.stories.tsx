import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import AutoComplete, {
  AutoCompleteProps,
} from '@akashaorg/design-system-core/lib/components/AutoComplete';

const meta: Meta<AutoCompleteProps> = {
  title: 'DSCore/Fields/AutoComplete',
  component: AutoComplete,
};

export default meta;
type Story = StoryObj<AutoCompleteProps>;

const Component = () => {
  const [query, setQuery] = useState('');

  return (
    <AutoComplete
      value={query}
      onChange={value => {
        if (typeof value === 'string') {
          setQuery(value);
          return;
        }
      }}
      options={['AKASHA', 'AKIRA', 'Travel', 'Cooking', 'Ethereum', 'Finance']}
      customStyle="w-fit"
      separators={['Comma', 'Space', 'Enter']}
      multiple
    />
  );
};

export const BaseAutoComplete: Story = {
  render: () => <Component />,
};
