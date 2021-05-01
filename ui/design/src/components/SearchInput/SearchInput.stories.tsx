import React from 'react';
import { Box, Grommet } from 'grommet';

import SearchInput, { ISearchInput } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Input/SearchInput',
  component: SearchInput,
};

const Template = (args: ISearchInput) => {
  const [inputValue, setInputValue] = React.useState('');
  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(ev.target.value);
  };
  const handleCancel = () => {
    setInputValue('');
  };
  return (
    <Grommet theme={lightTheme}>
      <Box fill={true} justify="center" align="center">
        <Box width="medium" pad={{ top: 'large' }}>
          <SearchInput
            {...args}
            inputValue={inputValue}
            onChange={handleInputChange}
            handleCancel={handleCancel}
          />
        </Box>
      </Box>
    </Grommet>
  );
};

export const BaseSearchInput = Template.bind({});

BaseSearchInput.args = {
  cancelLabel: 'x',
};
