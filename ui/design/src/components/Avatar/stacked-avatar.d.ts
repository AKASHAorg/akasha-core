import * as React from 'react';
export interface IStackedAvatarProps {
  userData: {
    ethAddress: string;
    avatar?: string;
  }[];
  maxAvatars?: number;
}
declare const StackedAvatar: React.FC<IStackedAvatarProps>;
export default StackedAvatar;
