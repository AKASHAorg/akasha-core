import React, { useState } from 'react';
import Tab from '@akashaorg/design-system-core/lib/components/Tab';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { EngagementType, QueryStatus } from '@akashaorg/typings/ui';
import { Profile } from '@akashaorg/typings/ui';
import { Engagement } from './Engagement';

export type EngagementItem = {
  label: string;
  status: QueryStatus['status'];
  data: Profile[];
};

export type EngagementsProps = {
  selectedStat: EngagementType;
  loggedProfileId: string;
  isFollowing: boolean;
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
  onChange: (selectedStat: EngagementType) => void;
};

const Engagements: React.FC<EngagementsProps> = props => {
  const { followers, following, selectedStat, onChange } = props;
  const [activeTab, setActiveTab] = useState(selectedStat === 'followers' ? 0 : 1);

  return (
    <Card radius={20} elevation="1" customStyle="py-4">
      <Tab
        value={activeTab}
        labels={[followers.label, following.label]}
        onChange={selectedIndex => {
          onChange(selectedIndex === 0 ? 'followers' : 'following');
          setActiveTab(selectedIndex);
        }}
      >
        <Engagement type="followers" follow={followers} {...props} />
        <Engagement type="following" follow={following} {...props} />
      </Tab>
    </Card>
  );
};

export default Engagements;
