import * as React from 'react';
import { tw } from '@twind/core';
import { IProfileData } from '@akashaorg/typings/ui';

import Avatar, { AvatarSize } from '../Avatar';
import Text from '../Text';

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

    const textStyle = 'text(lg:base md:xs) max-w([7rem] xs:[2rem])';

    return (
      <div className={tw(`inline-flex items-center justify-center ${customStyle}`)}>
        <div className={tw('shrink-0')}>
          <Avatar size={size} src={avatarImage} ethAddress={ethAddress} onClick={onClickAvatar} />
        </div>
        <div
          className={tw('pl(lg:4 md:2 sm:2 xs:1) justify-center align-top')}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <Text variant="button-sm" weight="bold" truncate={true} customStyle={textStyle}>
            {label || ethAddress}
          </Text>
          <Text variant="footnotes2" color="grey7" truncate={true}>
            {info}
          </Text>
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
