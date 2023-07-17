import React, { ReactElement } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import AvatarBlock from '@akashaorg/design-system-core/lib/components/AvatarBlock';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils/getColorClasses';
import { Profile } from '@akashaorg/typings/ui';

export type EntryProps = {
  profileAnchorLink: string;
  profileId: string;
  avatar: Profile['avatar'];
  name: string;
  borderBottom?: boolean;
  renderFollowElement: (profileId) => ReactElement;
  onProfileClick: (profileId: string) => void;
};

const Entry: React.FC<EntryProps> = props => {
  const {
    profileAnchorLink,
    profileId,
    avatar,
    name,
    borderBottom = true,
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
            avatar={avatar}
            name={name}
            userName={'' /*@TODO: revisit this part when username is implemented on the API side */}
            onClick={() => onProfileClick(profileId)}
          />
        </Anchor>
        {renderFollowElement(profileId)}
      </Stack>
    </Stack>
  );
};

export default Entry;
