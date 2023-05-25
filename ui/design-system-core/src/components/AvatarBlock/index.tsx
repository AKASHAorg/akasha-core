import React from 'react';
import Stack from '../Stack';
import Avatar from '../Avatar';
import Text from '../Text';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

type AvatarBlockProps = {
  profileId: Profile['did']['id'];
  avatar: Profile['avatar'];
  name: Profile['name'];
  userName: string;
};

const AvatarBlock: React.FC<AvatarBlockProps> = ({ profileId, avatar, name, userName }) => {
  return (
    <Stack align="center" spacing="gap-x-1">
      <Avatar profileId={profileId} size="md" avatar={avatar} customStyle="cursor-pointer" />
      <Stack direction="column" justify="center">
        <Text variant="button-md">{name}</Text>
        <Text variant="footnotes2">{userName}</Text>
      </Stack>
    </Stack>
  );
};

export default AvatarBlock;
