import React from 'react';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import { Profile } from '@akashaorg/typings/ui';

export interface ITrendingProfileCardProps {
  // data
  profiles: Profile[];
  followedProfiles?: string[];
  loggedEthAddress?: string | null;
  isLoadingProfiles?: boolean;
  // labels
  noProfilesLabel?: string;
  titleLabel: string;
  followLabel?: string;
  followersLabel?: string;
  unfollowLabel?: string;
  // anchor link
  profileAnchorLink: string;
  // handlers
  onClickProfile: (ethAddress: string) => void;
  handleFollowProfile: (ethAddress: string) => void;
  handleUnfollowProfile: (ethAddress: string) => void;
  // css
  className?: string;
  isViewer?: boolean;
}

const BaseTabPanelStyles = 'ring(white opacity-60  offset(2 blue-400)) focus:outline-none px-4';

const BaseItemStyles = 'flex justify-between items-center py-2';

const TrendingProfileCard: React.FC<ITrendingProfileCardProps> = props => {
  const {
    onClickProfile,
    handleFollowProfile,
    handleUnfollowProfile,
    loggedEthAddress,
    titleLabel,
    profiles,
    isLoadingProfiles,
    noProfilesLabel,
    followLabel,
    unfollowLabel,
    // followersLabel,
    profileAnchorLink,
    followedProfiles,
    isViewer,
  } = props;

  return (
    <BasicCardBox pad="0">
      <Box customStyle="py-4 pl-4">
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
            Array.from({ length: 3 }, (_el, index: number) => (
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
          {profiles.length !== 0 &&
            profiles.slice(0, 3).map((profile, index) => (
              <Box key={index} customStyle={BaseItemStyles}>
                <a
                  onClick={e => {
                    e.preventDefault();
                    return false;
                  }}
                  href={`${profileAnchorLink}/${profile.did.id}`}
                >
                  <ProfileAvatarButton
                    profileId={profile.did.id}
                    onClick={() => onClickProfile(profile.did.id)}
                    label={profile.name}
                    info={profile.did.id}
                    size="md"
                    avatarImage={profile.avatar}
                  />
                </a>
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
        </ul>
      </Box>
    </BasicCardBox>
  );
};

TrendingProfileCard.defaultProps = {
  titleLabel: 'Start Following',
  followLabel: 'Follow',
  unfollowLabel: 'Unfollow',
  followersLabel: 'Followers',
  noProfilesLabel: 'No profiles found!',
};

export default TrendingProfileCard;
