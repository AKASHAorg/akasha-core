import * as React from 'react';
import { Box, TextInput } from 'grommet';
import { Icon } from '../../Icon';

export interface ISearchBar {
  inputValue: string;
  onInputChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  inputPlaceholderLabel?: string;
  onSearch: (keyword: string) => void;
}

const SearchBar: React.FC<ISearchBar> = props => {
  const { inputValue, onInputChange, inputPlaceholderLabel, onSearch } = props;

  const handleSearch = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      onSearch(inputValue);
    }
  };

  return (
    <Box
      border={{ side: 'all', size: '1px', style: 'solid', color: 'border' }}
      round="large"
      direction="row"
      align="center"
      pad={{ vertical: 'xsmall', horizontal: 'small' }}
      height="2rem"
      width="15rem"
    >
      <TextInput
        size="xsmall"
        value={inputValue}
        onChange={onInputChange}
        placeholder={inputPlaceholderLabel}
        plain={true}
        onKeyDown={handleSearch}
      />
      <Icon type="search" size="xs" onClick={() => onSearch(inputValue)} clickable={true} />
    </Box>
  );
};

SearchBar.defaultProps = {
  inputPlaceholderLabel: 'Search profiles or topics...',
};

export { SearchBar };
