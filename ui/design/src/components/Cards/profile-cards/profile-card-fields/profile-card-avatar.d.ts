import * as React from 'react';
import { IProfileDataProvider, IProfileProvidersData } from '../profile-card';
import { LogoSourceType } from '@akashaproject/ui-awf-typings/lib/index';
export interface IProfileCardAvatarProps {
  editable: boolean;
  avatar?: string;
  avatarIcon?: LogoSourceType;
  avatarPopoverOpen: boolean;
  setAvatarPopoverOpen: (value: boolean) => void;
  handleChangeAvatar: (provider: IProfileDataProvider) => void;
  profileProvidersData?: IProfileProvidersData;
  ethAddress: string;
}
declare const ProfileCardAvatar: React.FC<IProfileCardAvatarProps>;
export default ProfileCardAvatar;
