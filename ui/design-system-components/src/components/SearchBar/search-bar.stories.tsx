import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SearchBar, { SearchBarProps } from '.';

const meta: Meta<SearchBarProps> = {
  title: 'Search/SearchBar',
  component: SearchBar,
};

export default meta;
type Story = StoryObj<SearchBarProps>;

const Component = () => {
  const [inputValue, setInputValue] = React.useState('');

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(ev.target.value);
  };

  return (
    <SearchBar
      inputValue={inputValue}
      inputPlaceholderLabel="Search"
      onInputChange={handleInputChange}
      onSearch={() => ({})}
    />
  );
};

export const BaseSearchBar: Story = {
  render: () => <Component />,
};
