import React, { ReactElement, useEffect, useRef } from 'react';
import InfiniteScroll from '../../InfiniteScroll';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import Entry from '../Entry';
import { useIntersection } from 'react-use';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils';
import { AkashaFollowers } from '@akashaorg/typings/lib/ui';
import { ENTRY_HEIGHT, EngagementProps } from '../types';

export type FollowersProps = {
  followers: AkashaFollowers;
  publicImgPath?: string;
  emptyEntryTitleLabel: ReactElement;
  emptyEntryBodyLabel: ReactElement;
} & EngagementProps;

const Followers: React.FC<FollowersProps> = ({
  publicImgPath,
  authenticatedDID,
  followList,
  followers,
  profileAnchorLink,
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
  const isEmptyEntry = followers.length === 0;

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
    <InfiniteScroll
      totalElements={followers.length}
      itemHeight={ENTRY_HEIGHT}
      overScan={1}
      onLoadMore={onLoadMore}
    >
      {({ index, itemIndex, itemsSize }) => {
        const engagement = followers[itemIndex];
        return (
          <Entry
            profileAnchorLink={profileAnchorLink}
            profileIds={{
              id: engagement?.did?.akashaProfile?.id,
              did: engagement?.did?.akashaProfile?.did?.id,
            }}
            avatar={engagement?.did?.akashaProfile?.avatar}
            name={engagement?.did?.akashaProfile?.name}
            followId={followList.get(engagement?.did?.akashaProfile?.id)?.id}
            isFollowing={followList.get(engagement?.did?.akashaProfile?.id)?.isFollowing}
            transformSource={transformSource}
            renderFollowElement={
              authenticatedDID !== engagement?.did?.akashaProfile?.did?.id
                ? renderFollowElement
                : null
            }
            onProfileClick={onProfileClick}
            customStyle={index + 1 !== itemsSize ? borderBottomStyle : ''}
          />
        );
      }}
    </InfiniteScroll>
  );
};

export default Followers;
