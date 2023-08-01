import React from 'react';
import IconButtonFollow from './icon-button-follow/icon-button-follow';
import { ModalNavigationOptions } from '@akashaorg/typings/ui';

type FollowProfileProps =
  | {
      profileId: string;
      isIconButton: boolean;
      showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
    }
  | {
      streamId?: string;
      isFollowing?: boolean;
      showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
    };

const FollowProfile: React.FC<FollowProfileProps> = props => {
  return 'isIconButton' in props ? <IconButtonFollow {...props} /> : <FollowProfile {...props} />;
};

export default FollowProfile;
