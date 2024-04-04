import React from 'react';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import type { Image, Profile } from '@akashaorg/typings/lib/ui';
import { getImageFromSeed } from '@akashaorg/design-system-core/lib/utils';

export type ProfileMiniCardProps = {
  publicImagePath?: string;
  profileData: Profile | null;
  authenticatedDID: string;
  beamsLabel?: string;
  followersLabel?: string;
  followingLabel?: string;
  statsLoading: boolean;
  stats: { followers: number; beams: number };
  transformSource: (src: Image) => Image;
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
    statsLoading,
    stats: { followers, beams },
    transformSource,
    handleClick,
    footerExt,
  } = props;

  const seed = getImageFromSeed(profileData?.did?.id, 3);
  const coverImageFallback = `${publicImagePath}/profile-cover-${seed}.webp`;

  return (
    <Card
      elevation="1"
      radius="rounded-2xl"
      margin="mb-4"
      padding="p-0"
      customStyle="max-h-[30rem]"
    >
      <Stack
        align="center"
        customStyle={`h-28 rounded-t-2xl bg(center cover [url(${
          profileData?.background?.default?.src ?? coverImageFallback
        })])`}
      >
        <Stack customStyle="relative top-16">
          <Avatar
            size="xl"
            border="sm"
            borderColor="darkerBlue"
            avatar={transformSource(profileData?.avatar?.default)}
            alternativeAvatars={profileData?.avatar?.alternatives?.map(alternative =>
              transformSource(alternative),
            )}
            profileId={profileData?.did?.id}
            customStyle="cursor-pointer"
            onClick={handleClick}
          />
        </Stack>
      </Stack>

      <Stack spacing="gap-y-4" align="center" padding="p-4" customStyle="pt-6">
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
          {statsLoading ? (
            <>
              <TextLine width="w-14" height="h-5" animated />
              <Text variant="subtitle2" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
                |
              </Text>
              <TextLine width="w-14" height="h-5" animated />
            </>
          ) : (
            <>
              <Text variant="subtitle2">
                {beams} {beamsLabel}
              </Text>
              <Text variant="subtitle2" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
                |
              </Text>
              <Text variant="subtitle2">
                {followers} {followersLabel}
              </Text>
            </>
          )}
        </Stack>

        {profileData?.description && (
          <Text breakWord={true} align="center" lineClamp={3}>
            {profileData.description}
          </Text>
        )}

        {authenticatedDID !== profileData?.did?.id && footerExt}
      </Stack>
    </Card>
  );
};

export default ProfileMiniCard;
