import * as React from 'react';
import { tw } from '@twind/core';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

export interface IEntryCardError {
  error: string;
  onRetry?: () => void;
}

const EntryCardError: React.FC<IEntryCardError> = props => {
  const { error, onRetry } = props;
  return (
    <div className={tw(`bg(warning-light dark:warning-dark) flex flex-row p-4 justify-between`)}>
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
