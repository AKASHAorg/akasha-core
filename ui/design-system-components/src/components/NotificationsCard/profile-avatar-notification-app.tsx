import * as React from 'react';
import { tw, apply } from '@twind/core';

import type { Image, Profile } from '@akashaorg/typings/lib/ui';

import Avatar, { AvatarSize } from '@akashaorg/design-system-core/lib/components/Avatar';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';

export interface ProfileAvatarNotificationAppProps {
  info?: string | React.ReactElement;
  avatar?: Profile['avatar'];
  label?: string | React.ReactElement;
  size?: AvatarSize;
  bold?: boolean;
  active?: boolean;
  customStyle?: string;
  profileId: string;
  transformSource: (src: Image) => Image;
  onClickAvatar?: () => void;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
}

const ProfileAvatarNotificationApp = React.forwardRef(
  (props: ProfileAvatarNotificationAppProps, ref: React.LegacyRef<HTMLDivElement>) => {
    const {
      customStyle = '',
      size,
      avatar,
      label,
      info,
      onClick,
      onClickAvatar,
      profileId,
      active,
      onMouseEnter,
      onMouseLeave,
      transformSource,
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
          <Avatar
            size={size}
            avatar={transformSource(avatar?.default)}
            alternativeAvatars={avatar?.alternatives?.map(alternative =>
              transformSource(alternative),
            )}
            profileId={profileId}
            onClick={onClickAvatar}
          />
        </div>
        <Button
          plain={true}
          customStyle="pl(lg:4 2) flex h-[50%] my-auto"
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className={tw(AlignmentStyle)}>
            <Text variant="footnotes2" weight="bold" truncate={true} align="center">
              {label || profileId}
            </Text>
          </div>
        </Button>
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
