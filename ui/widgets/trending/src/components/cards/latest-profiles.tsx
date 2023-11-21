import React from 'react';

import { FollowList, Profile, RootComponentProps } from '@akashaorg/typings/lib/ui';
import { getProfileImageVersionsWithMediaUrl } from '@akashaorg/ui-awf-hooks';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TrendingWidgetLoadingCard from '@akashaorg/design-system-components/lib/components/TrendingWidgetLoadingCard';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';

export type LatestProfilesProps = {
  // data
  profiles: Profile[];
  followList?: FollowList;
  loggedInProfileId?: string | null;
  isLoadingProfiles?: boolean;
  isLoggedIn: boolean;
  uiEvents: RootComponentProps['uiEvents'];
  // labels
  noProfilesLabel?: string;
  titleLabel: string;
  // handlers
  onClickProfile: (did: string) => void;
};

export const LatestProfiles: React.FC<LatestProfilesProps> = props => {
  const {
    onClickProfile,
    titleLabel,
    profiles,
    followList,
    isLoggedIn,
    isLoadingProfiles,
    noProfilesLabel,
    loggedInProfileId,
  } = props;

  const BaseTabPanelStyles = 'ring(white opacity-60  offset(2 blue-400)) focus:outline-none';

  if (profiles.length === 0 && isLoadingProfiles) return <TrendingWidgetLoadingCard />;

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

          <Stack spacing="gap-y-4">
            {profiles.length !== 0 &&
              profiles.map(profile => (
                <Stack
                  key={profile.id}
                  direction="row"
                  align="center"
                  justify="between"
                  spacing="gap-x-3"
                  customStyle="w-(full xl:[19rem])"
                >
                  <ProfileAvatarButton
                    profileId={profile.did.id}
                    label={profile.name}
                    size="md"
                    avatarImage={getProfileImageVersionsWithMediaUrl(profile.avatar)}
                    onClick={() => onClickProfile(profile.did.id)}
                  />

                  {loggedInProfileId !== profile.did.id && (
                    <Extension
                      name={`follow_${profile.id}`}
                      extensionData={{
                        profileID: profile.id,
                        isFollowing: followList?.get(profile.id)?.isFollowing,
                        isLoggedIn,
                        followId: followList?.get(profile.id)?.id,
                      }}
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
