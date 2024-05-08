import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SearchBar, { SearchBarProps } from '../../components/SearchBar';

const Component: React.FC<SearchBarProps> = props => {
  const [inputValue, setInputValue] = React.useState('');

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(ev.target.value);
  };

  return <SearchBar {...props} inputValue={inputValue} onInputChange={handleInputChange} />;
};

const meta: Meta<SearchBarProps> = {
  title: 'DSComponents/Bars/SearchBar',
  component: Component,
  tags: ['autodocs'],
  argTypes: {
    inputValue: { control: 'text' },
    inputPlaceholderLabel: { control: 'text' },
    onInputChange: { action: 'input changed' },
    onSearch: { action: 'searched' },
  },
};

type Story = StoryObj<SearchBarProps>;

export const Default: Story = {
  args: {
    inputPlaceholderLabel: 'Search',
    onSearch: () => ({}),
  },
};

export default meta;
