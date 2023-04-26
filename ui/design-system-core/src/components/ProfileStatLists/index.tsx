import React from 'react';
import Tab from '../Tab';
import Card from '../Card';
import { ProfileStatType, QueryStatus } from '@akashaorg/typings/ui';
import { StatList } from './StatList';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export type List = {
  label: string;
  status: QueryStatus['status'];
  data: Profile[];
  hasNextPage: boolean;
  onLoadMore?: () => void;
};

export type ProfileStatProps = {
  selectedStat: ProfileStatType;
  loggedProfileId: string;
  followedProfiles: string[];
  followers: List;
  following: List;
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
  onChange?: (selectedStat: ProfileStatType) => void;
};

const ProfileStatLists: React.FC<ProfileStatProps> = props => {
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
        <StatList type="followers" follow={followers} {...props} />
        <StatList type="following" follow={following} {...props} />
      </Tab>
    </Card>
  );
};

export default ProfileStatLists;
