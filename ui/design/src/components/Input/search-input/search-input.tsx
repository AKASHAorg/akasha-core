import { Box, FormField } from 'grommet';
import * as React from 'react';
import { Icon } from '../../Icon/index';
import { StyledTextInput } from '../link-input/styled-link-input';
import { IconLink } from '../../Buttons';

export interface ISearchInput {
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  handleCancel: React.EventHandler<React.SyntheticEvent>;
  inputValue: string;
  placeholderLabel?: string;
  cancelLabel?: string;
}

const SearchInput: React.FC<ISearchInput> = props => {
  const { onChange, handleCancel, inputValue, cancelLabel, placeholderLabel } = props;

  return (
    <FormField name="search" htmlFor="text-input">
      <Box fill="horizontal" direction="row" align="center" pad={{ vertical: 'xsmall' }}>
        <Box direction="row" gap="xsmall">
          <Icon type="search" />
          <StyledTextInput
            plain={true}
            value={inputValue}
            onChange={onChange}
            placeholder={placeholderLabel}
          />
        </Box>
        <IconLink label={cancelLabel} onClick={handleCancel} />
      </Box>
    </FormField>
  );
};

SearchInput.defaultProps = {
  placeholderLabel: 'Search something here',
  cancelLabel: 'Cancel',
};

export default SearchInput;
