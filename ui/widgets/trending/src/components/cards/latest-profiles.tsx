import React from 'react';

import { Profile } from '@akashaorg/typings/ui';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

export type LatestProfilesProps = {
  // data
  profiles: Profile[];
  followedProfiles?: string[];
  isViewer?: boolean;
  isLoadingProfiles?: boolean;
  // labels
  noProfilesLabel?: string;
  titleLabel: string;
  followLabel?: string;
  followersLabel?: string;
  unfollowLabel?: string;
  // handlers
  onClickProfile: (ethAddress: string) => void;
  handleFollowProfile: (ethAddress: string) => void;
  handleUnfollowProfile: (ethAddress: string) => void;
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
    isViewer,
  } = props;

  const BaseTabPanelStyles = 'ring(white opacity-60  offset(2 blue-400)) focus:outline-none';

  const BaseItemStyles = 'flex justify-between items-center space-y-2';

  return (
    <BasicCardBox pad="p-4">
      <Box customStyle="mb-4">
        <Text variant="button-md" weight="bold">
          {titleLabel}
        </Text>
      </Box>

      <Box customStyle={BaseTabPanelStyles}>
        <ul>
          {profiles.length === 0 && !isLoadingProfiles && (
            <Box customStyle="flex justify-center items-center py-2">
              <Text>{noProfilesLabel}</Text>
            </Box>
          )}

          {profiles.length === 0 &&
            isLoadingProfiles &&
            Array.from({ length: 4 }, (_el, index: number) => (
              <Box key={index} customStyle={BaseItemStyles}>
                <Box customStyle="py-2">
                  <TextLine title="avatar" width="40px" height="40px" customStyle="rounded-full" />

                  <Box customStyle="py-1">
                    <TextLine title="tagName" animated={false} width="140px" />
                    <TextLine title="tagName" animated={false} width="80px" />
                  </Box>
                </Box>

                <TextLine title="tagName" animated={false} width="7rem" height="2rem" />
              </Box>
            ))}

          <Box customStyle="space-y-4">
            {profiles.length !== 0 &&
              profiles.map((profile, index) => (
                <Box key={index} customStyle={BaseItemStyles}>
                  <ProfileAvatarButton
                    profileId={profile.did.id}
                    label={profile.name}
                    info={profile.did.id}
                    size="md"
                    avatarImage={profile.avatar}
                    onClick={() => onClickProfile(profile.did.id)}
                  />

                  {!isViewer && (
                    <Box>
                      <DuplexButton
                        inactiveLabel={followLabel}
                        activeLabel={unfollowLabel}
                        onClickInactive={() => handleFollowProfile(profile.did.id)}
                        onClickActive={() => handleUnfollowProfile(profile.did.id)}
                        active={followedProfiles?.includes(profile.did.id)}
                        allowMinimization={false}
                      />
                    </Box>
                  )}
                </Box>
              ))}
          </Box>
        </ul>
      </Box>
    </BasicCardBox>
  );
};
