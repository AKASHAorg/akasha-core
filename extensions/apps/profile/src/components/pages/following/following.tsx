import React, { ReactElement } from 'react';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import DynamicInfiniteScroll, {
  DynamicInfiniteScrollProps,
} from '@akashaorg/design-system-components/lib/components/DynamicInfiniteScroll';
import { ENTRY_HEIGHT, ITEM_SPACING } from '../constants';
import { GetFollowingListByDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { selectFollowings } from '@akashaorg/ui-core-hooks/lib/selectors/get-followings-list-by-did-query';
import { EngagementsEntry } from '../engagements-entry';
import { cssVars } from '@akashaorg/ui/lib/library/to-css-var';

export type FollowingProps = {
  followingsData: GetFollowingListByDidQuery;
  authenticatedDID: string;
  emptyEntryTitleLabel: ReactElement;
  emptyEntryBodyLabel: ReactElement;
  showNsfw: boolean;
  profileAnchorLink: string;
} & Pick<DynamicInfiniteScrollProps, 'hasNextPage' | 'loading' | 'onLoadMore'>;

const Following: React.FC<FollowingProps> = ({
  followingsData,
  authenticatedDID,
  showNsfw,
  profileAnchorLink,
  emptyEntryTitleLabel,
  emptyEntryBodyLabel,
  hasNextPage,
  loading,
  onLoadMore,
}) => {
  const followings = selectFollowings(followingsData);

  if (followings.length === 0) {
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
    <DynamicInfiniteScroll
      count={followings.length}
      estimatedHeight={ENTRY_HEIGHT}
      overScan={1}
      itemSpacing={ITEM_SPACING}
      hasNextPage={hasNextPage}
      loading={loading}
      onLoadMore={onLoadMore}
    >
      {({ index, itemIndex, itemsSize }) => {
        const following = followings[itemIndex];
        const profileInfo = following?.profile;
        return (
          <EngagementsEntry
            profileID={following.profileID}
            profileDID={profileInfo?.did?.id}
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

export default Following;
