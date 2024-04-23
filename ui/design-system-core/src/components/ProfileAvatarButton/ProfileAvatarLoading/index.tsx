import React from 'react';
import Stack from '../../Stack';
import TextLine from '../../TextLine';

type ProfileAvatarLoadingProps = {
  animated?: boolean;
};

const ProfileAvatarLoading: React.FC<ProfileAvatarLoadingProps> = props => {
  const { animated = false } = props;
  return (
    <Stack direction="row" spacing="gap-1">
      <TextLine
        round="rounded-full"
        height="h-10"
        width="w-10"
        customStyle="shrink-0"
        animated={animated}
      />
      <Stack direction="column" justify="center" spacing="gap-y-1">
        <TextLine width="w-28" height="h-4" animated={animated} />
        <TextLine width="w-24" height="h-4" animated={animated} />
      </Stack>
    </Stack>
  );
};

export default ProfileAvatarLoading;
