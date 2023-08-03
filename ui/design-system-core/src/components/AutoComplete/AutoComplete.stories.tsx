import React from 'react';
import { tw } from '@twind/core';
import type { Meta, StoryObj } from '@storybook/react';

import AutoComplete, { AutoCompleteProps } from '.';

const meta: Meta<AutoCompleteProps> = {
  title: 'Fields/AutoComplete',
  component: AutoComplete,
};

export default meta;
type Story = StoryObj<AutoCompleteProps>;

export const BaseAutoComplete: Story = {
  render: () => (
    <div className={tw('w-fit')}>
      <AutoComplete
        value=""
        onChange={() => ({})}
        options={['AKASHA', 'AKIRA', 'Travel', 'Cooking', 'Ethereum', 'Finance']}
      />
    </div>
  ),
};
