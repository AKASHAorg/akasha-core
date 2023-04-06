import * as React from 'react';
import { tw } from '@twind/core';
import { IProfileData } from '@akashaorg/typings/ui';

import Avatar, { AvatarSize } from '../Avatar';
import Text from '../Text';

import { truncateMiddle } from '../../utils/string-utils';

export interface ProfileAvatarButtonProps {
  info?: string | React.ReactElement;
  avatarImage?: IProfileData['avatar'];
  label?: string;
  size?: AvatarSize;
  customStyle?: string;
  onClickAvatar?: () => void;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  ethAddress: string;
  bold?: boolean;
  active?: boolean;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

const ProfileAvatarButton = React.forwardRef(
  (props: ProfileAvatarButtonProps, ref: React.Ref<HTMLElement>) => {
    const {
      customStyle = '',
      size,
      avatarImage,
      label,
      info,
      onClick,
      onClickAvatar,
      ethAddress,
      onMouseEnter,
      onMouseLeave,
    } = props;

    const textTrucateStyle = 'text-ellipsis overflow-hidden whitespace-nowrap truncate';

    return (
      <div className={tw(`inline-flex items-center justify-center ${customStyle}`)}>
        <div className={tw('shrink-0')}>
          <Avatar size={size} src={avatarImage} ethAddress={ethAddress} onClick={onClickAvatar} />
        </div>
        <div
          className={tw('pl(lg:4 md:2 sm:1 xs:0.5) justify-center align-top')}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <Text customStyle={textTrucateStyle}>{label || truncateMiddle(ethAddress)}</Text>

          <Text customStyle={`${textTrucateStyle} text-xs`}>{info}</Text>
        </div>
      </div>
    );
  },
);

const defaultProps = {
  size: 'md' as AvatarSize,
};

ProfileAvatarButton.defaultProps = defaultProps;

export default ProfileAvatarButton;
