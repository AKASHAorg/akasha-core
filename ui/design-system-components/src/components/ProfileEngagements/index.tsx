import React, { useState } from 'react';
import Tab from '@akashaorg/design-system-core/lib/components/Tab';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { EngagementType, QueryStatus } from '@akashaorg/typings/ui';
import { Profile } from '@akashaorg/typings/ui';
import { Engagement } from './Engagement';

export type EngagementItem = {
  label: string;
  status: QueryStatus['status'];
  data: { isFollowing: boolean; profile?: Profile }[];
};

export type EngagementsProps = {
  engagementType: EngagementType;
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
  onProfileClick: (profileId: string) => void;
  onFollow: (profileId: string) => void;
  onUnfollow: (profileId: string) => void;
  onChange: (engagementType: EngagementType) => void;
};

const Engagements: React.FC<EngagementsProps> = props => {
  const { followers, following, engagementType, onChange } = props;
  const [activeTab, setActiveTab] = useState(engagementType === 'followers' ? 0 : 1);

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
        <Engagement type="followers" engagements={followers} {...props} />
        <Engagement type="following" engagements={following} {...props} />
      </Tab>
    </Card>
  );
};

export default Engagements;
