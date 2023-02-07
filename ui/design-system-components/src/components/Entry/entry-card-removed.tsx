import * as React from 'react';
import { tw } from '@twind/core';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

export interface IEntryCardRemoved {
  isAuthor: boolean;
  removedByMeLabel?: string;
  removedByAuthorLabel?: string;
}

const EntryCardRemoved: React.FC<IEntryCardRemoved> = props => {
  const { isAuthor, removedByAuthorLabel, removedByMeLabel } = props;
  return (
    <Box pad={{ horizontal: 'medium' }} margin={{ vertical: 'small' }}>
      <Box
        pad="medium"
        border={{ style: 'dashed', side: 'all', color: 'lightGrey' }}
        round="xsmall"
      >
        <Box direction="row" align="center">
          <Icon size="md" color="grey" type="trash" />
          <Box margin={{ left: 'small' }}>
            {isAuthor ? `${removedByMeLabel}.` : `${removedByAuthorLabel}.`}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { EntryCardRemoved };
