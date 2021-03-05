import * as React from 'react';
export interface IProfileData {
  CID?: string;
  avatar?: string;
  coverImage?: string;
  userName?: string;
  description?: string;
  name?: string;
  url?: string;
  ensName?: string;
  ethAddress: string;
  pubKey: string;
  totalPosts?: string | number;
  totalFollowers?: string | number;
  totalFollowing?: string | number;
  apps?: string | number;
  profileType?: string;
  users?: string | number;
  actions?: string;
}
export interface IProfileWidgetCard {
  className?: string;
  loggedEthAddress?: string | null;
  onClickFollowers?: React.EventHandler<React.SyntheticEvent>;
  onClickFollowing?: React.EventHandler<React.SyntheticEvent>;
  onClickPosts?: React.EventHandler<React.SyntheticEvent>;
  handleUnfollow?: React.EventHandler<React.SyntheticEvent>;
  handleFollow?: React.EventHandler<React.SyntheticEvent>;
  isFollowing?: boolean;
  profileData: IProfileData;
  descriptionLabel: string;
  postsLabel: string;
  followingLabel: string;
  followersLabel: string;
  followLabel?: string;
  unfollowLabel?: string;
  shareProfileLabel: string;
}
declare const ProfileWidgetCard: React.FC<IProfileWidgetCard>;
export default ProfileWidgetCard;
