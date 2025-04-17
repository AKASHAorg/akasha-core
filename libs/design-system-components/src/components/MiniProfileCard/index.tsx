import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import type { Image, Profile } from '@akashaorg/typings/lib/ui';
import { getColorClasses, getImageFromSeed } from '@akashaorg/design-system-core/lib/utils';
import {
  ProfileAvatar,
  ProfileAvatarFallback,
  ProfileAvatarImage,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar';

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
    <Card className="p-0 mb-4 max-h-[30rem]">
      <Stack
        alignItems="center"
        className={`h-28 rounded-t-2xl bg(center cover [url(${
          coverImage?.src ?? coverImageFallback
        })])`}
      >
        <Stack className="relative top-16">
          <button onClick={handleClick}>
            <ProfileAvatar
              profileDID={profileData?.did?.id}
              size="xl"
              nsfw={profileData?.nsfw}
              className="border-2 border-border"
            >
              <ProfileAvatarImage src={transformSource(profileData?.avatar?.default)?.src} />
              <ProfileAvatarFallback />
            </ProfileAvatar>
          </button>
        </Stack>
      </Stack>
      <Stack spacing={4} alignItems="center" className="pt-6 pb-4 px-4">
        <Stack spacing={2} alignItems="center">
          <Stack spacing={1} alignItems="center" className="mt-3">
            {profileData?.name && (
              <Text
                variant="h6"
                breakWord={true}
                customStyle={`cursor-pointer hover:underline ${getColorClasses(
                  { light: 'black', dark: 'white' },
                  'hover:decoration',
                )}`}
              >
                {profileData.name}
              </Text>
            )}
            {profileData?.did?.id && (
              <DidField did={profileData.did.id} isValid={true} copiable={false} />
            )}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
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
