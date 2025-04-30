import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import EntryLoading from './entry-loading';
import { cssVars } from '@akashaorg/ui/lib/library/to-css-var';

export const LOADING_LIST_SIZE = 5;

type ProfileEngagementLoadingProps = {
  itemSpacing: number;
};

const ProfileEngagementLoading: React.FC<ProfileEngagementLoadingProps> = props => {
  const { itemSpacing } = props;
  const entryStyle = `pb-[var(--item-spacing)] border-b border-grey8 dark:border-grey5`;
  return (
    <Stack
      style={cssVars({ '--item-spacing': `${itemSpacing / 16}rem` })}
      direction="column"
      spacing={4}
    >
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
