import React from 'react';
import { Profile } from '@akashaorg/typings/lib/ui';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { getImageFromSeed } from '@akashaorg/design-system-core/lib/utils';

export type ProfileMiniCardProps = {
  publicImagePath?: string;
  profileData: Profile | null;
  authenticatedDID: string;
  beamsLabel?: string;
  followersLabel?: string;
  followingLabel?: string;
  stats: { followers: number; beams: number };
  handleClick?: () => void;
  footerExt?: React.ReactNode;
};

const ProfileMiniCard: React.FC<ProfileMiniCardProps> = props => {
  const {
    publicImagePath = '/images',
    profileData,
    authenticatedDID,
    beamsLabel,
    followersLabel,
    stats: { followers, beams },
    handleClick,
    footerExt,
  } = props;

  const seed = getImageFromSeed(profileData?.did?.id, 3);
  const coverImageFallback = `${publicImagePath}/profile-cover-${seed}.webp`;

  return (
    <Card
      elevation="1"
      radius="rounded-2xl"
      onClick={handleClick}
      margin='mb-4'
      padding="p-0"
      customStyle="max-h-[30rem]"
    >
      <Stack
        align="center"
        customStyle={`h-28 rounded-t-2xl bg(center cover [url(${
          profileData?.background?.default?.src ?? coverImageFallback
        })])`}
      >
        <Avatar
          size="xl"
          border="sm"
          borderColor="darkerBlue"
          avatar={profileData?.avatar}
          profileId={profileData?.did?.id}
          customStyle="relative top-16"
        />
      </Stack>

      <Stack spacing="gap-y-6" align="center" padding="p-6">
        <Stack spacing="gap-y-1" padding="pt-3" align="center">
          {profileData?.name && (
            <Text variant="h6" breakWord={true}>
              {profileData.name}
            </Text>
          )}

          {profileData?.did?.id && (
            <DidField did={profileData.did.id} isValid={true} copiable={false} />
          )}
        </Stack>

        <Stack direction="row" spacing="gap-x-3" align="center" justify="center">
          <Text variant="subtitle2">
            {beams} {beamsLabel}
          </Text>
          <Text variant="subtitle2" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
            |
          </Text>
          <Text variant="subtitle2">
            {followers} {followersLabel}
          </Text>
        </Stack>

        {profileData?.description && (
          <Text breakWord={true} truncate={true}>
            {profileData.description}
          </Text>
        )}

        {authenticatedDID !== profileData?.did?.id && footerExt}
      </Stack>
    </Card>
  );
};

export default ProfileMiniCard;
