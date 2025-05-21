import React, { ReactElement } from 'react';
import {
  InfiniteScroll,
  InfiniteScrollList,
} from '@akashaorg/ui/lib/akasha-components/infinite-scroll';
import { ENTRY_HEIGHT, ITEM_SPACING } from '../constants';
import { GetFollowersListByDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { selectFollowers } from '@akashaorg/ui-core-hooks/lib/selectors/get-followers-list-by-did-query';
import { EngagementsEntry } from '../engagements-entry';
import { cssVars } from '@akashaorg/ui/lib/library/to-css-var';

export type FollowersProps = {
  followersData: GetFollowersListByDidQuery;
  authenticatedDID: string;
  emptyEntryTitleLabel: ReactElement;
  emptyEntryBodyLabel: ReactElement;
  showNsfw: boolean;
  profileAnchorLink: string;
  hasNextPage?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
};

const Followers: React.FC<FollowersProps> = ({
  followersData,
  authenticatedDID,
  emptyEntryTitleLabel,
  emptyEntryBodyLabel,
  showNsfw,
  profileAnchorLink,
  hasNextPage,
  loading,
  onLoadMore,
}) => {
  const followers = selectFollowers(followersData);

  if (followers.length === 0) {
    return (
      <InfoCard
        titleLabel={emptyEntryTitleLabel}
        bodyLabel={emptyEntryBodyLabel}
        assetName="longbeam-notfound"
        customStyle="px-4"
      />
    );
  }

  const borderBottomStyle = `pb-[var(--item-spacing)] border-b border-grey8 dark:border-grey5`;

  return (
    <InfiniteScroll
      count={followers.length}
      estimatedHeight={ENTRY_HEIGHT}
      gap={ITEM_SPACING}
      overScan={1}
      hasNextPage={hasNextPage}
      loading={loading}
      onLoadMore={onLoadMore}
    >
      <InfiniteScrollList>
        {itemIndex => {
          const follower = followers[itemIndex];
          const profileInfo = follower?.did?.akashaProfile;
          return (
            <EngagementsEntry
              profileID={profileInfo?.id}
              profileDID={profileInfo?.did.id ?? follower?.did?.id}
              profileInfo={profileInfo}
              authenticatedDID={authenticatedDID}
              showNsfw={showNsfw}
              profileAnchorLink={profileAnchorLink}
              style={cssVars({ '--item-spacing': `${ITEM_SPACING / 16}rem` })}
              className={itemIndex !== followers.length - 1 ? borderBottomStyle : ''}
            />
          );
        }}
      </InfiniteScrollList>
    </InfiniteScroll>
  );
};

export default Followers;
