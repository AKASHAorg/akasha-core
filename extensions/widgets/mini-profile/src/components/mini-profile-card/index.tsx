import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Skeleton } from '@akashaorg/ui/lib/components/skeleton';
import type { Image, Profile } from '@akashaorg/typings/lib/ui';
import { getImageFromSeed } from '@akashaorg/design-system-core/lib/utils';
import {
  ProfileAvatar,
  ProfileAvatarFallback,
  ProfileAvatarImage,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar';
import { cssVars } from '@akashaorg/ui/lib/library/to-css-var';
import {
  ProfileAvatarButton,
  ProfileDidField,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
export type MiniProfileCardProps = {
  publicImagePath?: string;
  profileData: Profile | null;
  authenticatedDID: string;
  beamsLabel?: string;
  followersLabel?: string;
  followingLabel?: string;
  statsLoading: boolean;
  stats: {
    followers: number;
    following: number;
    beams: number;
  };
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
        style={cssVars({
          '--background-url': `url('${coverImage?.src ?? coverImageFallback}')`,
        })}
        className={`h-28 rounded-t-2xl bg-center bg-cover bg-(image:--background-url)`}
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
              <Typography variant="h6" className="break-all">
                {profileData.name}
              </Typography>
            )}
            {profileData?.did?.id && (
              <ProfileAvatarButton profileDID={profileData.did.id}>
                <ProfileDidField />
              </ProfileAvatarButton>
            )}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            {statsLoading ? (
              <>
                <Skeleton className="w-14 h-5" />
                <RenderText label="|" />
                <Skeleton className="w-14 h-5" />
                <RenderText label="|" />
                <Skeleton className="w-14 h-5" />
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
            <Typography variant="xs" className="font-medium break-all text-center line-clamp-3">
              {profileData.description}
            </Typography>
          )}
        </Stack>
        {authenticatedDID !== profileData?.did?.id && footerExt}
      </Stack>
    </Card>
  );
};
const RenderText = ({ label }: { label: string }) => (
  <Typography variant="xs" className="font-medium text-grey4 dark:text-grey7">
    {label}
  </Typography>
);
export default MiniProfileCard;
