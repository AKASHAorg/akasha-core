import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EntryLoading from './entry-loading';
import { LOADING_LIST_SIZE } from '../types';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils';

const ProfileEngagementLoading: React.FC = () => {
  const borderBottomStyle = `border-b ${getColorClasses(
    {
      light: 'grey8',
      dark: 'grey5',
    },
    'border',
  )}`;
  return (
    <Stack direction="column" spacing="gap-y-4">
      {Array.from({ length: LOADING_LIST_SIZE }).map((_, index, items) => (
        <EntryLoading
          key={`${index}`}
          customStyle={index + 1 !== items.length ? borderBottomStyle : ''}
        />
      ))}
    </Stack>
  );
};

export default ProfileEngagementLoading;
