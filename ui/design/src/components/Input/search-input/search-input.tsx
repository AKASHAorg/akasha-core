import { Box } from 'grommet';
import * as React from 'react';
import Icon from '../../Icon';
import { StyledTextInput, StyledFormField } from '../link-input/styled-link-input';
import IconLink from '../../IconLink';

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
    <StyledFormField name="search" htmlFor="text-input">
      <Box
        fill="horizontal"
        direction="row"
        align="center"
        pad={{ bottom: 'xsmall' }}
        justify="between"
      >
        <Box direction="row" gap="xsmall" fill="horizontal">
          <Icon type="search" />
          <StyledTextInput
            plain={true}
            value={inputValue}
            onChange={onChange}
            placeholder={placeholderLabel}
            autoFocus={true}
            onKeyDown={ev => {
              if (ev.key === 'Escape') {
                handleCancel(ev);
              }
              return;
            }}
          />
        </Box>
        <IconLink label={cancelLabel} onClick={handleCancel} />
      </Box>
    </StyledFormField>
  );
};

SearchInput.defaultProps = {
  placeholderLabel: 'Search something here',
  cancelLabel: 'Cancel',
};

export default SearchInput;
