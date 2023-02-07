import * as React from 'react';
import TextIcon from '../TextIcon';
import { tw } from '@twind/core';

export interface IEntryCardError {
  error: string;
  onRetry?: () => void;
}

const EntryCardError: React.FC<IEntryCardError> = props => {
  const { error, onRetry } = props;
  return (
    <div className={tw(`bg(warning-light dark:warning-dark) flex(row) p-4 justify-between`)}>
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
    </div>
  );
};

export { EntryCardError };
