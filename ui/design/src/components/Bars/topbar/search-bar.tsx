import * as React from 'react';
import { Box, TextInput } from 'grommet';
import { Icon } from '../../Icon';

export interface ISearchBar {
  inputValue: string;
  onInputChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  inputPlaceholderLabel?: string;
  handleKeyDown: (ev: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<ISearchBar> = props => {
  const { inputValue, onInputChange, inputPlaceholderLabel, handleKeyDown } = props;
  return (
    <Box
      border={{ side: 'all', size: '1px', style: 'solid', color: 'border' }}
      round="large"
      direction="row"
      align="center"
      pad="xsmall"
      height="2rem"
      fill="horizontal"
    >
      <Icon type="search" />
      <TextInput
        value={inputValue}
        onChange={onInputChange}
        placeholder={inputPlaceholderLabel}
        plain={true}
        onKeyDown={handleKeyDown}
      />
    </Box>
  );
};

SearchBar.defaultProps = {
  inputPlaceholderLabel: 'Find profiles, topics and apps',
};

export { SearchBar };
