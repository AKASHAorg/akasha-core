import * as React from 'react';
import { Box, TextInput } from 'grommet';
import Icon from '../Icon';
import styled from 'styled-components';

const SearchContainer = styled(Box)`
  transition: width 0.3s ease;
  width: 100%;
  background-color: ${props => props.theme.colors.inputBackground};
  @media only screen and (min-width: ${props => props.theme.breakpoints.large.value}px) {
    width: 55%;
  }
`;

const StyledSearchInput = styled(TextInput)`
  color: ${props => props.theme.colors.inputText};
`;

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
    <SearchContainer
      border={{ side: 'all', size: '1px', style: 'solid', color: 'border' }}
      round="large"
      direction="row"
      align="center"
      pad={{ vertical: 'xsmall', horizontal: 'small' }}
      height="2rem"
    >
      <StyledSearchInput
        size="xsmall"
        value={inputValue}
        onChange={onInputChange}
        placeholder={inputPlaceholderLabel}
        plain={true}
        onKeyDown={handleSearch}
        color="inputText"
      />
      <Icon
        type="search"
        size="xs"
        onClick={() => onSearch(inputValue)}
        clickable={true}
        color={'#47484A'}
      />
    </SearchContainer>
  );
};

SearchBar.defaultProps = {
  inputPlaceholderLabel: 'Search profiles or topics...',
};

export { SearchBar };
