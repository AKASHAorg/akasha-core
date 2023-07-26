import React, { ReactElement } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import AvatarBlock from '@akashaorg/design-system-core/lib/components/AvatarBlock';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils/getColorClasses';
import { Profile } from '@akashaorg/typings/ui';
import { ProfileImageVersions } from '@akashaorg/typings/sdk/graphql-types-new';

export type EntryProps = {
  profileAnchorLink: string;
  profileId: string;
  profileStreamId: string;
  avatar: Profile['avatar'];
  name: string;
  followStreamId: string;
  isFollowing: boolean;
  borderBottom?: boolean;
  getMediaUrl: (image?: ProfileImageVersions) => ProfileImageVersions;
  renderFollowElement: (
    profileStreamId: string,
    followStreamId: string,
    isFollowing: boolean,
  ) => ReactElement | null;
  onProfileClick: (profileId: string) => void;
};

const Entry: React.FC<EntryProps> = props => {
  const {
    profileAnchorLink,
    profileId,
    profileStreamId,
    avatar,
    name,
    followStreamId,
    isFollowing,
    borderBottom = true,
    getMediaUrl,
    renderFollowElement,
    onProfileClick,
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
            avatar={getMediaUrl(avatar)}
            name={name}
            userName={'' /*@TODO: revisit this part when username is implemented on the API side */}
            onClick={() => onProfileClick(profileId)}
          />
        </Anchor>
        {renderFollowElement && renderFollowElement(profileStreamId, followStreamId, isFollowing)}
      </Stack>
    </Stack>
  );
};

export default Entry;
