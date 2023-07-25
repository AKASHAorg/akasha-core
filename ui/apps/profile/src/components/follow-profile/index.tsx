import React from 'react';
import IconButtonFollow from './icon-button-follow/icon-button-follow';
import { NavigateToParams } from '@akashaorg/typings/ui';

type FollowProfileProps =
  | { profileId: string; navigateTo?: (args: NavigateToParams) => void }
  | {
      streamId?: string;
      isFollowing?: boolean;
      navigateTo?: (args: NavigateToParams) => void;
    };

const FollowProfile: React.FC<FollowProfileProps> = props => {
  return 'profileId' in props ? <IconButtonFollow {...props} /> : <FollowProfile {...props} />;
};

export default FollowProfile;
