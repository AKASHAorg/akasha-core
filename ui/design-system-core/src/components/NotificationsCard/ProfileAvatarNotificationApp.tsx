import * as React from 'react';
import Text from '../Text';
import Avatar from '../Avatar';
import { AvatarSize } from '../Avatar';
import { tw, apply } from '@twind/core';
import { Profile } from '@akashaorg/typings/ui';

export interface ProfileAvatarNotificationAppProps {
  info?: string | React.ReactElement;
  avatarImage?: Profile['avatar'];
  label?: string | React.ReactElement;
  size?: AvatarSize;
  bold?: boolean;
  active?: boolean;
  customStyle?: string;
  profileId: string;
  onClickAvatar?: () => void;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

const ProfileAvatarNotificationApp = React.forwardRef(
  (props: ProfileAvatarNotificationAppProps, ref: React.LegacyRef<HTMLDivElement>) => {
    const {
      customStyle = '',
      size,
      avatarImage,
      label,
      info,
      onClick,
      onClickAvatar,
      profileId,
      active,
      onMouseEnter,
      onMouseLeave,
    } = props;

    const AlignmentStyle = apply`
    flex justify-center align-center
    `;

    return (
      <div ref={ref} className={tw(apply(`grid grid-cols-[60px_1fr] ${customStyle}`))}>
        <div className={tw(`shrink-0 ${AlignmentStyle}`)}>
          <div className="flex items-center	pr-3 ">
            {/* active purple circle  */}
            {active && (
              <div className={tw('w-2 h-2 rounded-full bg(secondaryLight dark:secondaryDark)')} />
            )}
          </div>
          <Avatar size={size} avatar={avatarImage} profileId={profileId} onClick={onClickAvatar} />
        </div>
        <div
          className={tw(apply(`pl(lg:4 2) flex h-[50%] my-auto`))}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className={tw(AlignmentStyle)}>
            <Text variant="footnotes2" weight="bold" truncate={true} align="center">
              {label || profileId}
            </Text>
          </div>
        </div>
        <div />
        <div className={tw(apply(`pl(lg:4 2)`))}>
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

ProfileAvatarNotificationApp.defaultProps = defaultProps;

export default ProfileAvatarNotificationApp;
