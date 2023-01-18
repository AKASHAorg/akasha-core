import { IProfileData } from '@akashaorg/typings/ui';
import { AvatarSize } from './avatar.interface';

export type UserDataType = { ethAddress: string; avatar?: IProfileData['avatar'] }[];

export interface IStackedAvatarProps {
  userData: UserDataType;
  maxAvatars?: number;
  size?: AvatarSize;
}
