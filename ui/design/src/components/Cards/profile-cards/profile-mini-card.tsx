import { Box, Text } from 'grommet';
import * as React from 'react';
import { Avatar } from '../../Avatar/index';
import { MiniProfileAvatarDiv } from './styled-profile-card';
import { DuplexButton } from '../../Buttons';
import { Icon } from '../../Icon';
import { IProfileData } from './profile-widget-card';

export interface IProfileMiniCard {
  // data
  profileData: IProfileData;
  // labels
  followLabel?: string;
  followinglabel?: string;
  unfollowLabel?: string;
  postsLabel?: string;
  // handlers
  handleFollow: (profileEthAddress: string) => void;
  handleUnfollow: (profileEthAddress: string) => void;
}

const ProfileMiniCard: React.FC<IProfileMiniCard> = props => {
  const {
    profileData,
    followLabel,
    followinglabel,
    unfollowLabel,
    postsLabel,
    handleFollow,
    handleUnfollow,
  } = props;

  const onFollow = () => {
    handleFollow(profileData.ethAddress);
  };

  const onUnfollow = () => {
    handleUnfollow(profileData.ethAddress);
  };

  return (
    <Box
      round="xsmall"
      direction="column"
      background="ultraLightBackground"
      border={{ side: 'all', color: 'border', size: 'xsmall', style: 'solid' }}
    >
      <Box
        height="4rem"
        background={profileData.coverImage}
        pad="none"
        round={{ corner: 'top', size: 'xsmall' }}
        align="center"
      >
        <MiniProfileAvatarDiv>
          <Avatar
            border="lg"
            size="xl"
            src={profileData.avatar}
            ethAddress={profileData.ethAddress}
          />
        </MiniProfileAvatarDiv>
      </Box>
      <Box direction="column" align="center" justify="center">
        <Box pad={{ top: 'large', bottom: 'small' }} margin={{ top: 'medium' }} align="center">
          {profileData.userName && (
            <Text size="large" weight="bold" color="primaryText">
              {profileData.userName}
            </Text>
          )}
          <Text size="medium" color="secondaryText">
            {profileData.ethAddress}
          </Text>
          <Box direction="row" gap="xsmall">
            {profileData.ensName && (
              <Text size="medium" color="secondaryText">
                {profileData.ensName}
              </Text>
            )}
          </Box>
          <Text>{`${profileData.postsNumber || 0} ${postsLabel}`}</Text>
        </Box>
      </Box>

      <Box direction="column" pad="medium" gap="medium">
        <Text color="primaryText">{profileData.description}</Text>
        <DuplexButton
          inactiveLabel={followLabel}
          activeLabel={followinglabel}
          activeHoverLabel={unfollowLabel}
          onClickInactive={onFollow}
          onClickActive={onUnfollow}
          active={profileData.isFollowed}
          icon={<Icon type="following" />}
        />
      </Box>
    </Box>
  );
};

ProfileMiniCard.defaultProps = {
  followLabel: 'Follow',
  followinglabel: 'Following',
  unfollowLabel: 'Unfollow',
  postsLabel: 'Posts',
};

export { ProfileMiniCard };
