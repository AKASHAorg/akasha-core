import React, { ReactElement } from 'react';
import DynamicInfiniteScroll, {
  DynamicInfiniteScrollProps,
} from '@akashaorg/design-system-core/lib/components/DynamicInfiniteScroll';
import { ENTRY_HEIGHT, ITEM_SPACING } from '../constants';
import { GetFollowersListByDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { selectFollowers } from '@akashaorg/ui-core-hooks/lib/selectors/get-followers-list-by-did-query';
import { EngagementsEntry } from '../engagements-entry';
import { cssVars } from '@akashaorg/ui/lib/library/to-css-var';
import {
  InlineNotification,
  InlineNotificationDescription,
  InlineNotificationTitle,
} from '@akashaorg/ui/lib/akasha-components/inline-notification';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
export type FollowersProps = {
  followersData: GetFollowersListByDidQuery;
  authenticatedDID: string;
  emptyEntryTitleLabel: ReactElement;
  emptyEntryBodyLabel: ReactElement;
  showNsfw: boolean;
  profileAnchorLink: string;
} & Pick<DynamicInfiniteScrollProps, 'hasNextPage' | 'loading' | 'onLoadMore'>;

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
      <Stack direction="column" className="p-4">
        <InlineNotification variant="info" className="p-4">
          <InlineNotificationTitle>{emptyEntryTitleLabel}</InlineNotificationTitle>
          <InlineNotificationDescription>{emptyEntryBodyLabel}</InlineNotificationDescription>
        </InlineNotification>
      </Stack>
    );
  }

  const borderBottomStyle = `pb-[var(--item-spacing)] border-b border-grey8 dark:border-grey5`;

  return (
    <DynamicInfiniteScroll
      count={followers.length}
      estimatedHeight={ENTRY_HEIGHT}
      overScan={1}
      itemSpacing={ITEM_SPACING}
      hasNextPage={hasNextPage}
      loading={loading}
      onLoadMore={onLoadMore}
    >
      {({ index, itemIndex, itemsSize }) => {
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
            className={index + 1 !== itemsSize ? borderBottomStyle : ''}
          />
        );
      }}
    </DynamicInfiniteScroll>
  );
};

export default Followers;
