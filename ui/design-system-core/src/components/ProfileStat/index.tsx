import React from 'react';
import Stack from '../Stack';
import Tab from '../Tab';
import Card from '../Card';
import { IProfileData, ProfileStatType, QueryStatus } from '@akashaorg/typings/ui';
import { StatList } from './StatList';

export type Stat = {
  label: string;
  status: QueryStatus['status'];
  data: IProfileData[];
  hasNextPage: boolean;
  onLoadMore?: () => void;
};

export type ProfileStatProps = {
  activeTab: ProfileStatType;
  pubKeyOfLoggedUser: string;
  followedProfiles: string[];
  followers: Stat;
  following: Stat;
  followLabel: string;
  unFollowLabel: string;
  followingLabel: string;
  profileAnchorLink: string;
  loadingMoreLabel: string;
  onError: () => void;
  onProfileClick: (ethAddress: string) => void;
  onFollow: (ethAddress: string) => void;
  onUnfollow: (ethAddress: string) => void;
};

const ProfileStat: React.FC<ProfileStatProps> = props => {
  const { followers, following, activeTab } = props;
  return (
    <Card radius={20} elevation="1" customStyle="py-4">
      <Tab
        activeTab={activeTab === 'followers' ? 0 : 1}
        labels={[followers.label, following.label]}
      >
        <Stack direction="column">
          <StatList follow={followers} {...props} />
        </Stack>
        <Stack direction="column">
          <StatList follow={following} {...props} />
        </Stack>
      </Tab>
    </Card>
  );
};

export default ProfileStat;
