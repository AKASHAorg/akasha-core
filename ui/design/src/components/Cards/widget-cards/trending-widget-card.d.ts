import * as React from 'react';
export interface ITrendingWidgetCardProps {
  tags: ITag[];
  profiles: IProfile[];
  followedProfiles?: string[];
  subscribedTags?: string[];
  loggedEthAddress?: string | null;
  titleLabel: string;
  topicsLabel: string;
  profilesLabel: string;
  followLabel?: string;
  followingLabel?: string;
  followersLabel?: string;
  unfollowLabel?: string;
  subscribeLabel?: string;
  unsubscribeLabel?: string;
  subscribedLabel?: string;
  onClickTag: (tagName: string) => void;
  onClickProfile: (ethAddress: string) => void;
  handleFollowProfile: (ethAddress: string) => void;
  handleUnfollowProfile: (ethAddress: string) => void;
  handleSubscribeTag: (tagName: string) => void;
  handleUnsubscribeTag: (tagName: string) => void;
  className?: string;
}
export interface ITag {
  name: string;
  totalPosts: number;
}
export interface IProfile {
  ethAddress: string;
  pubKey: string;
  avatar?: string;
  coverImage?: string;
  description?: string;
  userName?: string;
  name?: string;
  totalFollowers?: number | string;
  totalFollowing?: number | string;
}
declare const TrendingWidgetCard: React.FC<ITrendingWidgetCardProps>;
export default TrendingWidgetCard;
