import React from 'react';

import { Profile } from '@akashaorg/typings/ui';
import { getProfileImageVersionsWithMediaUrl } from '@akashaorg/ui-awf-hooks';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TrendingWidgetLoadingCard from '@akashaorg/design-system-components/lib/components/TrendingWidgetLoadingCard';

export type LatestProfilesProps = {
  // data
  profiles: Profile[];
  followedProfiles?: string[];
  loggedUserDid?: string | null;
  isLoadingProfiles?: boolean;
  // labels
  noProfilesLabel?: string;
  titleLabel: string;
  followLabel?: string;
  followersLabel?: string;
  unfollowLabel?: string;
  // handlers
  onClickProfile: (did: string) => void;
  handleFollowProfile: (did: string) => void;
  handleUnfollowProfile: (did: string) => void;
};

export const LatestProfiles: React.FC<LatestProfilesProps> = props => {
  const {
    onClickProfile,
    handleFollowProfile,
    handleUnfollowProfile,
    titleLabel,
    profiles,
    isLoadingProfiles,
    noProfilesLabel,
    followLabel,
    unfollowLabel,
    followedProfiles,
    loggedUserDid,
  } = props;

  const BaseTabPanelStyles = 'ring(white opacity-60  offset(2 blue-400)) focus:outline-none';

  return (
    <Card padding={16}>
      <Stack customStyle="mb-4">
        <Text variant="button-md" weight="bold">
          {titleLabel}
        </Text>
      </Stack>

      <Stack customStyle={BaseTabPanelStyles}>
        <ul>
          {profiles.length === 0 && !isLoadingProfiles && (
            <Stack justify="center" align="center" customStyle="py-2">
              <Text>{noProfilesLabel}</Text>
            </Stack>
          )}

          {profiles.length === 0 &&
            isLoadingProfiles &&
            Array.from({ length: 4 }, (_el, index: number) => (
              <React.Fragment key={index}>
                <TrendingWidgetLoadingCard />
              </React.Fragment>
            ))}

          <Stack spacing="gap-y-4">
            {profiles.length !== 0 &&
              profiles.map((profile, index) => (
                <Stack
                  key={index}
                  direction="row"
                  align="center"
                  justify="between"
                  spacing="gap-y-2"
                >
                  <ProfileAvatarButton
                    profileId={profile.did.id}
                    label={profile.name}
                    size="md"
                    avatarImage={getProfileImageVersionsWithMediaUrl(profile.avatar)}
                    onClick={() => onClickProfile(profile.did.id)}
                  />

                  {loggedUserDid !== profile.did.id && (
                    <DuplexButton
                      inactiveLabel={followLabel}
                      activeLabel={unfollowLabel}
                      onClickInactive={() => handleFollowProfile(profile.did.id)}
                      onClickActive={() => handleUnfollowProfile(profile.did.id)}
                      active={followedProfiles?.includes(profile.did.id)}
                      allowMinimization={false}
                    />
                  )}
                </Stack>
              ))}
          </Stack>
        </ul>
      </Stack>
    </Card>
  );
};
