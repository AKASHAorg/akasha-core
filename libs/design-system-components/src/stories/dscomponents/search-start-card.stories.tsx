import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SearchStartCard, { SearchStartProps } from '../../components/SearchStartCard';

const meta: Meta<SearchStartProps> = {
  title: 'DSComponents/Cards/SearchStartCard',
  component: SearchStartCard,
  tags: ['autodocs'],
};

type Story = StoryObj<SearchStartProps>;

export const Default: Story = {
  args: {
    searchKeyword: '',
    titleLabel: 'Search',
    inputPlaceholderLabel: 'Search',
    handleSearch: () => ({}),
    handleTopMenuClick: () => ({}),
    children: <p>Search card content</p>,
  },
};

export default meta;
