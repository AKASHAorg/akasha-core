import React from 'react';

import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

import Avatar from '../Avatar';
import Stack from '../Stack';
import Text from '../Text';

export type AvatarBlockProps = {
  profileId: Profile['did']['id'];
  avatar: Profile['avatar'];
  name: Profile['name'];
  userName: string;
  onClick?: () => void;
};

const AvatarBlock: React.FC<AvatarBlockProps> = ({
  profileId,
  avatar,
  name,
  userName,
  onClick,
}) => {
  return (
    <Stack align="center" spacing="gap-x-1">
      <Avatar
        profileId={profileId}
        size="md"
        avatar={avatar}
        customStyle="cursor-pointer"
        onClick={onClick}
      />
      <Stack direction="column" justify="center">
        <Text variant="button-md">{name}</Text>
        <Text variant="footnotes2">{userName}</Text>
      </Stack>
    </Stack>
  );
};

export default AvatarBlock;
