import React from 'react';
import Tab from '@akashaorg/design-system-core/lib/components/Tab';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { EngagementType, QueryStatus } from '@akashaorg/typings/ui';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';
import { Engagement } from './Engagement';

export type EngagementItem = {
  label: string;
  status: QueryStatus['status'];
  data: Profile[];
  hasNextPage: boolean;
  onLoadMore?: () => void;
};

export type EngagementsProps = {
  selectedStat: EngagementType;
  loggedProfileId: string;
  followedProfiles: string[];
  followers: EngagementItem;
  following: EngagementItem;
  followLabel: string;
  unFollowLabel: string;
  followingLabel: string;
  profileAnchorLink: string;
  loadingMoreLabel: string;
  ownerUserName: string;
  viewerIsOwner: boolean;
  onError: () => void;
  onProfileClick: (ethAddress: string) => void;
  onFollow: (ethAddress: string) => void;
  onUnfollow: (ethAddress: string) => void;
  onChange?: (selectedStat: EngagementType) => void;
};

const Engagements: React.FC<EngagementsProps> = props => {
  const { followers, following, selectedStat, onChange } = props;
  return (
    <Card radius={20} elevation="1" customStyle="py-4">
      <Tab
        activeTab={selectedStat === 'followers' ? 0 : 1}
        labels={[followers.label, following.label]}
        onChange={selectedIndex => {
          if (onChange) onChange(selectedIndex === 0 ? 'followers' : 'following');
        }}
      >
        <Engagement type="followers" follow={followers} {...props} />
        <Engagement type="following" follow={following} {...props} />
      </Tab>
    </Card>
  );
};

export default Engagements;
