import React from 'react';
import { Box } from 'grommet';
import SearchBar, { ISearchBar } from './index';

export default {
  title: 'Bars/SearchBar',
  component: SearchBar,
  argTypes: {
    inputValue: { control: 'text' },
    inputPlaceholderLabel: { control: 'text' },
    onInputChange: { action: 'input changed' },
  },
};

const Template = (args: ISearchBar) => {
  const [inputValue, setInputValue] = React.useState('');
  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(ev.target.value);
  };
  return (
    <div>
      <Box pad="large" align="center">
        <SearchBar {...args} onInputChange={handleInputChange} inputValue={inputValue} />
      </Box>
    </div>
  );
};

export const BaseSearchBar = Template.bind({});

BaseSearchBar.args = {
  inputValue: '',
  inputPlaceholderLabel: 'Search',
};
