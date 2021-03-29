import * as React from 'react';
import { Box, TextInput } from 'grommet';
import { Icon } from '../../Icon';

export interface ISearchBar {
  inputValue: string;
  setInputValue: any;
  inputPlaceholderLabel?: string;
  onSearch: (keyword: string) => void;
  handleCloseInput: () => void;
}

const MobileSearchBar: React.FC<ISearchBar> = props => {
  const { inputValue, setInputValue, inputPlaceholderLabel, onSearch, handleCloseInput } = props;

  const [inputFocus, setInputFocus] = React.useState(false);

  const handleSearch = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      onSearch(inputValue);
    }
  };

  return (
    <Box
      direction="row"
      align="center"
      pad={{ vertical: 'xsmall', horizontal: 'small' }}
      fill="horizontal"
      height="3rem"
    >
      <Icon type="arrowLeft" primaryColor={true} size="xs" onClick={handleCloseInput} />
      <TextInput
        autoFocus={true}
        size="xsmall"
        value={inputValue}
        onChange={ev => {
          setInputValue(ev.target.value);
        }}
        placeholder={inputPlaceholderLabel}
        plain={true}
        onKeyDown={handleSearch}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
      />
      {inputValue && !inputFocus ? (
        <Icon
          type="close"
          size="md"
          onClick={() => {
            setInputValue('');
          }}
          primaryColor={true}
        />
      ) : (
        <Icon
          type="search"
          size="md"
          onClick={() => {
            if (inputValue) onSearch(inputValue);
          }}
        />
      )}
    </Box>
  );
};

MobileSearchBar.defaultProps = {
  inputPlaceholderLabel: 'Search profiles or topics',
};

export { MobileSearchBar };
