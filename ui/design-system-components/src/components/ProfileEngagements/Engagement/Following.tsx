import React, { ReactElement } from 'react';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import Entry from '../Entry';
import InfiniteScroll from '../../InfiniteScroll';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils';
import { AkashaFollowing } from '@akashaorg/typings/lib/ui';
import { ENTRY_HEIGHT, EngagementProps } from '../types';

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
  emptyEntryTitleLabel,
  emptyEntryBodyLabel,
  onLoadMore,
  transformSource,
  renderFollowElement,
  onProfileClick,
}) => {
  const isEmptyEntry = following.length === 0;

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
      totalElements={following.length}
      itemHeight={ENTRY_HEIGHT}
      overScan={1}
      onLoadMore={onLoadMore}
    >
      {({ index, itemIndex, itemsSize }) => {
        const engagement = following[itemIndex];
        return (
          <Entry
            profileAnchorLink={profileAnchorLink}
            profileIds={{
              id: engagement?.profile?.id,
              did: engagement?.profile?.did.id,
            }}
            avatar={engagement?.profile?.avatar}
            name={engagement?.profile?.name}
            followId={followList.get(engagement?.profile?.id)?.id}
            isFollowing={followList.get(engagement?.profile?.id)?.isFollowing}
            transformSource={transformSource}
            renderFollowElement={
              authenticatedDID !== engagement?.profile?.did.id ? renderFollowElement : null
            }
            onProfileClick={onProfileClick}
            customStyle={index + 1 !== itemsSize ? borderBottomStyle : ''}
          />
        );
      }}
    </InfiniteScroll>
  );
};

export default Following;
