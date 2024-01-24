import React, { ReactElement, useEffect, useRef } from 'react';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import Entry from '../Entry';
import { useIntersection } from 'react-use';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils';
import { AkashaFollowing } from '@akashaorg/typings/lib/ui';
import { EngagementProps } from '../types';

export type FollowingProps = {
  following: AkashaFollowing;
  publicImgPath?: string;
  emptyEntryTitleLabel: ReactElement;
  emptyEntryBodyLabel: ReactElement;
} & EngagementProps;

const Following: React.FC<FollowingProps> = ({
  publicImgPath,
  authenticatedDID,
  followList,
  following,
  profileAnchorLink,
  loadMore,
  emptyEntryTitleLabel,
  emptyEntryBodyLabel,
  onLoadMore,
  transformSource,
  renderFollowElement,
  onProfileClick,
}) => {
  const loadMoreRef = useRef(null);
  const intersection = useIntersection(loadMoreRef, {
    threshold: 0,
  });
  const isEmptyEntry = following.length === 0;

  useEffect(() => {
    if (intersection?.isIntersecting) {
      onLoadMore();
    }
  }, [intersection, onLoadMore]);

  if (isEmptyEntry) {
    return (
      <InfoCard
        titleLabel={emptyEntryTitleLabel}
        bodyLabel={emptyEntryBodyLabel}
        publicImgPath={publicImgPath}
        assetName="longbeam-notfound"
      />
    );
  }

  const borderBottomStyle = `border-b ${getColorClasses(
    {
      light: 'grey8',
      dark: 'grey5',
    },
    'border',
  )}`;

  return (
    <Stack spacing="gap-y-4">
      {following.map((engagement, index, engagements) => (
        <Stack
          direction="row"
          key={`${engagement?.id}-${index}`}
          customStyle={index + 1 !== engagements.length ? borderBottomStyle : ''}
        >
          <Entry
            profileAnchorLink={profileAnchorLink}
            profileIds={{ id: engagement?.profile?.id, did: engagement?.profile?.did.id }}
            avatar={engagement?.profile?.avatar}
            name={engagement?.profile?.name}
            followId={followList.get(engagement?.profile?.id)?.id}
            isFollowing={followList.get(engagement?.profile?.id)?.isFollowing}
            transformSource={transformSource}
            renderFollowElement={
              authenticatedDID !== engagement?.profile?.did.id ? renderFollowElement : null
            }
            onProfileClick={onProfileClick}
          />
        </Stack>
      ))}
      <Stack customStyle="mx-auto" ref={loadMoreRef}>
        {loadMore && <Spinner />}
      </Stack>
    </Stack>
  );
};

export default Following;
