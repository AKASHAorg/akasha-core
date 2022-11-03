import * as React from 'react';
import { Anchor, Box } from 'grommet';
import TextIcon from '../TextIcon';

export interface IEntryCardError {
  error: string;
  onRetry?: () => void;
}

const EntryCardError: React.FC<IEntryCardError> = props => {
  const { error, onRetry } = props;
  return (
    <Box background="warning" direction="row" pad="medium" justify="between">
      <TextIcon iconType="alert" label={error} iconSize="sm" fontSize="medium" />
      <Anchor
        onClick={event => {
          event.preventDefault();
          if (onRetry) onRetry();
        }}
        size="medium"
        weight="normal"
        color="accentText"
        style={{ textDecoration: 'none' }}
      >
        Retry
      </Anchor>
    </Box>
  );
};

export { EntryCardError };
