import React from 'react';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils/getColorClasses';
import { Profile } from '@akashaorg/typings/ui';
import AvatarBlock from '@akashaorg/design-system-core/lib/components/AvatarBlock';

export type EntryProps = {
  followLabel: string;
  unFollowLabel: string;
  followingLabel: string;
  profileAnchorLink: string;
  profileId: string;
  avatar: Profile['avatar'];
  name: string;
  isFollowing: boolean;
  borderBottom?: boolean;
  onProfileClick: (profileId: string) => void;
  onFollow: (profileId: string) => void;
  onUnfollow: (profileId: string) => void;
};

const Entry: React.FC<EntryProps> = props => {
  const {
    followLabel,
    unFollowLabel,
    followingLabel,
    profileAnchorLink,
    profileId,
    avatar,
    name,
    isFollowing,
    borderBottom = true,
    onProfileClick,
    onFollow,
    onUnfollow,
  } = props;

  const borderBottomStyle = borderBottom
    ? `border-b ${getColorClasses(
        {
          light: 'grey8',
          dark: 'grey5',
        },
        'border',
      )}`
    : '';

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle={`px-4 pb-4 ${borderBottomStyle}`}>
      <Stack align="center" justify="between">
        <Anchor href={`${profileAnchorLink}/${profileId}`}>
          <AvatarBlock
            profileId={profileId}
            avatar={avatar}
            name={name}
            userName={'' /*@TODO: revisit this part when username is implemented on the API side */}
            onClick={() => onProfileClick(profileId)}
          />
        </Anchor>
        <DuplexButton
          inactiveLabel={followLabel}
          activeLabel={followingLabel}
          activeHoverLabel={unFollowLabel}
          onClickInactive={() => onFollow(profileId)}
          onClickActive={() => onUnfollow(profileId)}
          active={isFollowing}
          size="sm"
          allowMinimization
        />
      </Stack>
    </Stack>
  );
};

export default Entry;
