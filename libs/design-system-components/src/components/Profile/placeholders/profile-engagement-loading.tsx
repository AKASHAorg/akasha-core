import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import EntryLoading from './entry-loading';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils';

export const LOADING_LIST_SIZE = 5;

type ProfileEngagementLoadingProps = {
  itemSpacing: number;
};

const ProfileEngagementLoading: React.FC<ProfileEngagementLoadingProps> = props => {
  const { itemSpacing } = props;
  const entryStyle = `pb-[${itemSpacing / 16}rem] border-b ${getColorClasses(
    {
      light: 'grey8',
      dark: 'grey5',
    },
    'border',
  )}`;
  return (
    <Stack direction="column" spacing={4}>
      {Array.from({ length: LOADING_LIST_SIZE }).map((_, index, items) => (
        <EntryLoading
          key={`${index}`}
          customStyle={`px-4 ${index + 1 !== items.length ? entryStyle : ''}`}
        />
      ))}
    </Stack>
  );
};

export default ProfileEngagementLoading;
