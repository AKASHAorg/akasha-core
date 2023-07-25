import React from 'react';
import Entry from '../Entry';
import EntryError from '../Entry/EntryError';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EmptyEntry from '../Entry/EmptyEntry';
import { tw } from '@twind/core';
import { EngagementProps } from '../types';
import { ProfileEngagementLoading } from '../placeholders/ProfileEngagementLoading';

export type FollowingProps = {
  ownerUserName: string;
  viewerIsOwner: boolean;
} & EngagementProps;

const Following: React.FC<FollowingProps> = ({
  engagement,
  profileAnchorLink,
  ownerUserName,
  viewerIsOwner,
  renderFollowElement,
  onError,
  onProfileClick,
}) => {
  const isEmptyEntry = engagement.status === 'success' && engagement.data.length === 0;

  if (isEmptyEntry) {
    return (
      <div className={tw('mt-12')}>
        <EmptyEntry type="following" userName={ownerUserName} viewerIsOwner={viewerIsOwner} />
      </div>
    );
  }

  return (
    <Stack direction="column" spacing="gap-y-4">
      {engagement.status === 'loading' && <ProfileEngagementLoading />}
      {engagement.status === 'error' && (
        <div className={tw('mt-12')}>
          <EntryError onError={onError} />
        </div>
      )}
      {engagement.status === 'success' &&
        engagement.data.map((engagement, index) => (
          <Entry
            key={`${engagement?.profile.id}-${index}`}
            profileAnchorLink={profileAnchorLink}
            profileId={engagement?.profile.id}
            avatar={engagement?.profile.avatar}
            name={engagement?.profile.name}
            streamId={engagement.id}
            isFollowing={engagement.isFollowing}
            renderFollowElement={renderFollowElement}
            onProfileClick={onProfileClick}
          />
        ))}
    </Stack>
  );
};

export default Following;
