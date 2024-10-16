import React from 'react';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import type { Image, Profile } from '@akashaorg/typings/lib/ui';
import { getImageFromSeed } from '@akashaorg/design-system-core/lib/utils';

export type MiniProfileCardProps = {
  publicImagePath?: string;
  profileData: Profile | null;
  authenticatedDID: string;
  beamsLabel?: string;
  followersLabel?: string;
  followingLabel?: string;
  statsLoading: boolean;
  stats: { followers: number; following: number; beams: number };
  transformSource: (src: Image) => Image;
  handleClick?: () => void;
  footerExt?: React.ReactNode;
};

const MiniProfileCard: React.FC<MiniProfileCardProps> = props => {
  const {
    publicImagePath = '/images',
    profileData,
    authenticatedDID,
    beamsLabel,
    followersLabel,
    followingLabel,
    statsLoading,
    stats: { followers, following, beams },
    transformSource,
    handleClick,
    footerExt,
  } = props;

  const seed = getImageFromSeed(profileData?.did?.id, 3);
  const coverImageFallback = `${publicImagePath}/profile-cover-${seed}.webp`;
  const coverImage = transformSource(profileData?.background?.default);

  return (
    <Card radius="rounded-2xl" margin="mb-4" padding="p-0" customStyle="max-h-[30rem]">
      <Stack
        align="center"
        customStyle={`h-28 rounded-t-2xl bg(center cover [url(${
          coverImage?.src ?? coverImageFallback
        })])`}
      >
        <Stack customStyle="relative top-16">
          <Avatar
            size="xl"
            border="sm"
            borderColor="white"
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
      <Stack spacing="gap-y-4" align="center" padding="pt-6 pb-4 px-4">
        <Stack spacing="gap-y-2" align="center">
          <Stack spacing="gap-y-1" align="center" customStyle="mt-3">
            {profileData?.name && (
              <Text variant="h6" breakWord={true}>
                {profileData.name}
              </Text>
            )}
            {profileData?.did?.id && (
              <DidField did={profileData.did.id} isValid={true} copiable={false} />
            )}
          </Stack>
          <Stack direction="row" spacing="gap-x-1" align="center" justify="center">
            {statsLoading ? (
              <>
                <TextLine width="w-14" height="h-5" animated />
                <RenderText label="|" />
                <TextLine width="w-14" height="h-5" animated />
                <RenderText label="|" />
                <TextLine width="w-14" height="h-5" animated />
              </>
            ) : (
              <>
                <RenderText label={`${beams} ${beamsLabel}`} />
                <RenderText label="|" />
                <RenderText label={`${followers} ${followersLabel}`} />
                <RenderText label="|" />
                <RenderText label={`${following} ${followingLabel}`} />
              </>
            )}
          </Stack>
          {profileData?.description && (
            <Text variant="footnotes2" breakWord={true} align="center" lineClamp={3}>
              {profileData.description}
            </Text>
          )}
        </Stack>
        {authenticatedDID !== profileData?.did?.id && footerExt}
      </Stack>
    </Card>
  );
};

const RenderText = ({ label }: { label: string }) => (
  <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey7' }}>
    {label}
  </Text>
);

export default MiniProfileCard;
