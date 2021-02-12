import * as React from 'react';
import { Box, TextInput } from 'grommet';
import { Icon } from '../../Icon';

export interface ISearchBar {
  inputValue: string;
  setInputValue: any;
  inputPlaceholderLabel?: string;
  handleKeyDown: (ev: React.KeyboardEvent<HTMLInputElement>) => void;
  handleCloseInput: () => void;
}

const MobileSearchBar: React.FC<ISearchBar> = props => {
  const {
    inputValue,
    setInputValue,
    inputPlaceholderLabel,
    handleKeyDown,
    handleCloseInput,
  } = props;

  return (
    <Box
      direction="row"
      align="center"
      pad={{ vertical: 'xsmall', horizontal: 'small' }}
      fill="horizontal"
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
        onKeyDown={handleKeyDown}
      />
      {inputValue ? (
        <Icon
          type="close"
          size="xs"
          onClick={() => {
            setInputValue('');
          }}
          primaryColor={true}
        />
      ) : (
        <Icon type="search" size="xs" />
      )}
    </Box>
  );
};

MobileSearchBar.defaultProps = {
  inputPlaceholderLabel: 'Search profiles or topics',
};

export { MobileSearchBar };
