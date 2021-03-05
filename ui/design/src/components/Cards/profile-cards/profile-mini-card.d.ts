import * as React from 'react';
import { IProfileData } from './profile-widget-card';
export interface IProfileMiniCard {
  profileData: IProfileData;
  loggedEthAddress?: string | null;
  isFollowing?: boolean;
  followLabel?: string;
  followingLabel?: string;
  followersLabel?: string;
  unfollowLabel?: string;
  postsLabel?: string;
  handleFollow?: (profileEthAddress: string) => void;
  handleUnfollow?: (profileEthAddress: string) => void;
  disableFollowing?: boolean;
}
declare const ProfileMiniCard: React.FC<IProfileMiniCard>;
export { ProfileMiniCard };
