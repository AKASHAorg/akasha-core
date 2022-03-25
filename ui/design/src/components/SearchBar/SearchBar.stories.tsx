import React from 'react';
import { Box, Grommet } from 'grommet';

import lightTheme from '../../styles/themes/light/light-theme';
import { ISearchBar, SearchBar } from './index';

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
    <Grommet theme={lightTheme}>
      <Box pad="large" align="center">
        <SearchBar {...args} onInputChange={handleInputChange} inputValue={inputValue} />
      </Box>
    </Grommet>
  );
};

export const BaseSearchBar = Template.bind({});

BaseSearchBar.args = {
  inputValue: '',
  inputPlaceholderLabel: 'Search',
};
