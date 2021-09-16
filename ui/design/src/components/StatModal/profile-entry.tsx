import React from 'react';
import { Box } from 'grommet';

import Icon from '../Icon';
import DuplexButton from '../DuplexButton';
import ProfileAvatarButton from '../ProfileAvatarButton';
import { StyledAnchor } from '../EntryCard/basic-card-box';
import { IProfileData } from '../ProfileCard/profile-widget-card';

export interface IProfileEntry {
  ipfsGateway?: string;

  entries?: IProfileData[];
  followedProfiles?: string[];

  followLabel: string;
  unfollowLabel: string;
  followingLabel: string;

  // anchor link
  profileAnchorLink: string;

  // handlers
  onClickProfile: (ethAddress: string) => void;
  handleFollowProfile: (ethAddress: string) => void;
  handleUnfollowProfile: (ethAddress: string) => void;
}

const ProfileEntry: React.FC<IProfileEntry> = props => {
  const {
    ipfsGateway,
    entries,
    followedProfiles,
    followLabel,
    unfollowLabel,
    followingLabel,
    profileAnchorLink,
    onClickProfile,
    handleFollowProfile,
    handleUnfollowProfile,
  } = props;

  return (
    <Box flex={false} pad={{ top: 'large' }} gap="medium">
      {entries &&
        entries.map((entry, index) => (
          <Box key={index} direction="row" justify="between" align="center">
            <StyledAnchor
              onClick={e => {
                e.preventDefault();
                return false;
              }}
              weight="normal"
              href={`${profileAnchorLink}/${entry.pubKey}`}
              label={
                <Box width="11rem" pad="none">
                  <ProfileAvatarButton
                    ethAddress={entry.ethAddress}
                    onClick={() => onClickProfile(entry.pubKey)}
                    label={entry.name || entry.userName}
                    info={`@${entry.userName ? entry.userName : 'username'}`}
                    size="md"
                    avatarImage={entry.avatar ? `${ipfsGateway}/${entry.avatar}` : entry.avatar}
                  />
                </Box>
              }
            />
            <Box width="7rem">
              <DuplexButton
                inactiveLabel={followLabel}
                activeLabel={followingLabel}
                activeHoverLabel={unfollowLabel}
                onClickInactive={() => handleFollowProfile(entry.ethAddress)}
                onClickActive={() => handleUnfollowProfile(entry.ethAddress)}
                active={followedProfiles?.includes(entry.ethAddress)}
                icon={<Icon type="following" />}
              />
            </Box>
          </Box>
        ))}
    </Box>
  );
};

export default ProfileEntry;
