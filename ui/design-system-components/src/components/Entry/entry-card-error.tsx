import * as React from 'react';
import DS from '@akashaorg/design-system-core';
import { tw } from '@twind/core';

const { Icon, Text } = DS;

export interface IEntryCardError {
  error: string;
  onRetry?: () => void;
}

const EntryCardError: React.FC<IEntryCardError> = props => {
  const { error, onRetry } = props;
  return (
    <div className={tw(`bg(warning-light dark:warning-dark) flex(row) p-4 justify-between`)}>
      <div className={tw(`flex flex-row gap-4`)}>
        <Icon type="ExclamationTriangleIcon" />
        <Text>{error}</Text>
      </div>
      <a
        className={tw(`text-color-secondary no-underline`)}
        onClick={event => {
          event.preventDefault();
          if (onRetry) onRetry();
        }}
      >
        Retry
      </a>
    </div>
  );
};

export { EntryCardError };
