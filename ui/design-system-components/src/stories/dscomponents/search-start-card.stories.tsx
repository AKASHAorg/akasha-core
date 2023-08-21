import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import SearchStartCard, { SearchStartProps } from '../../components/SearchStartCard';

const meta: Meta<SearchStartProps> = {
  title: 'DSComponents/Cards/SearchStartCard',
  component: SearchStartCard,
};

export default meta;
type Story = StoryObj<SearchStartProps>;

export const BaseSearchStartCard: Story = {
  render: () => (
    <SearchStartCard
      searchKeyword=""
      inputPlaceholderLabel="Search"
      handleSearch={() => ({})}
      handleTopMenuClick={() => ({})}
    >
      <p>Search card content</p>
    </SearchStartCard>
  ),
};
