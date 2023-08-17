import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EntryLoading from './EntryLoading';
import { LOADING_LIST_SIZE } from '../types';

const ProfileEngagementLoading: React.FC = () => {
  return (
    <Stack direction="column" spacing="gap-y-4">
      {Array.from({ length: LOADING_LIST_SIZE }).map((_, index) => (
        <EntryLoading key={`${index}`} />
      ))}
    </Stack>
  );
};

export default ProfileEngagementLoading;
