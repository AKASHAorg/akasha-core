import * as React from 'react';
import { AvatarSize } from '../../Avatar/styled-avatar';
export interface ProfileAvatarButtonProps {
  info?: string | React.ReactElement;
  avatarImage?: string;
  label?: string;
  size?: AvatarSize;
  className?: string;
  onClickAvatar?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  ethAddress: string;
  bold?: boolean;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}
declare const ProfileAvatarButton: React.ForwardRefExoticComponent<
  ProfileAvatarButtonProps & React.RefAttributes<unknown>
>;
export default ProfileAvatarButton;
