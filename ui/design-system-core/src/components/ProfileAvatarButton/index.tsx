import * as React from 'react';
import { IProfileData } from '@akashaorg/typings/ui';
import { truncateMiddle } from '../../utils/string-utils';
import Avatar from '../Avatar';
import { AvatarSize } from '../Avatar';
import { tw, apply } from '@twind/core';

export interface ProfileAvatarButtonProps {
  info?: string | React.ReactElement;
  avatarImage?: IProfileData['avatar'];
  label?: string;
  size?: AvatarSize;
  className?: string;
  onClickAvatar?: () => void;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  ethAddress: string;
  bold?: boolean;
  active?: boolean;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

const BaseStyles = apply`
    text-ellipsis overflow-hidden whitespace-nowrap truncate 
    `;

const ProfileAvatarButton = React.forwardRef(
  (props: ProfileAvatarButtonProps, ref: React.Ref<HTMLElement>) => {
    const {
      className,
      size,
      avatarImage,
      label,
      info,
      onClick,
      onClickAvatar,
      ethAddress,
      active,
      onMouseEnter,
      onMouseLeave,
    } = props;
    return (
      <div className={tw(`inline-flex items-center justify-center ${className ? className : ''} `)}>
        <div className={tw('shrink-0')}>
          <Avatar size={size} src={avatarImage} ethAddress={ethAddress} onClick={onClickAvatar} />
        </div>
        <div
          className={tw('pl-4 md:pl-2 sm:pl-1 xs:pl-0.5 justify-center align-top')}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div
            className={tw(
              `${BaseStyles} text-base sm:text-xs xs:text-xs max-w-[7rem] md:max-w-[5rem] sm:max-w-[4rem] xs:max-w-[2rem]`,
            )}
          >
            <span ref={ref}>{label || truncateMiddle(ethAddress)}</span>
          </div>
          <div
            className={tw(
              `${BaseStyles} max-w-[10rem] md:max-w-[5rem] sm:max-w-[4rem] xs:max-w-[2rem] text-xs sm:text-[10px] xs:text-[10px]
              ${active ? ' text-white ' : ' text-black '}`,
            )}
          >
            {info}
          </div>
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
