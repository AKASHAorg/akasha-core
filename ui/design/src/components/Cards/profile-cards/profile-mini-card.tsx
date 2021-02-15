import { Box, Text } from 'grommet';
import * as React from 'react';
import { Avatar } from '../../Avatar/index';
import { MiniProfileAvatarDiv } from './styled-profile-card';
import { DuplexButton } from '../../Buttons';
import { Icon } from '../../Icon';
import { IProfileData } from './profile-widget-card';
import { truncateMiddle } from '../../../utils/string-utils';

export interface IProfileMiniCard {
  // data
  profileData: IProfileData;
  loggedEthAddress?: string | null;
  isFollowing?: boolean;
  // labels
  followLabel?: string;
  followingLabel?: string;
  followersLabel?: string;
  unfollowLabel?: string;
  postsLabel?: string;
  // handlers
  handleFollow: (profileEthAddress: string) => void;
  handleUnfollow: (profileEthAddress: string) => void;
}

const ProfileMiniCard: React.FC<IProfileMiniCard> = props => {
  const {
    profileData,
    loggedEthAddress,
    followLabel,
    followingLabel,
    followersLabel,
    unfollowLabel,
    postsLabel,
    handleFollow,
    handleUnfollow,
    isFollowing,
  } = props;

  const onFollow = () => {
    handleFollow(profileData.ethAddress);
  };

  const onUnfollow = () => {
    handleUnfollow(profileData.ethAddress);
  };

  // check if a user is logged in and different from the profile displayed
  const showFollowingButton = loggedEthAddress && profileData.ethAddress !== loggedEthAddress;

  return (
    <Box
      round="xsmall"
      direction="column"
      border={{ side: 'all', color: 'border', size: 'xsmall', style: 'solid' }}
    >
      <Box
        height="4rem"
        background={`url(${profileData.coverImage})`}
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
      <Box direction="column" align="center" justify="center" pad={{ horizontal: 'xsmall' }}>
        <Box pad={{ top: 'large', bottom: 'medium' }} margin={{ top: 'medium' }} align="center">
          {profileData.name && (
            <Text
              size="large"
              weight="bold"
              color="primaryText"
              wordBreak="break-word"
              textAlign="center"
            >
              {profileData.name}
            </Text>
          )}
          <Text size="medium" color="secondaryText" wordBreak="break-word" textAlign="center">
            {(profileData.userName && `@${profileData.userName}`) ||
              truncateMiddle(profileData.ethAddress)}
          </Text>
          {profileData.CID && (
            <Text size="small" color="primaryText" wordBreak="break-word" textAlign="center">
              {`CID: ${profileData.CID}`}
            </Text>
          )}
        </Box>
        <Box direction="row" gap="xsmall">
          <Text size="small" color="secondaryText">{`${
            profileData.totalPosts || 0
          } ${postsLabel}`}</Text>
          <Text size="small" color="secondaryText">{`${
            profileData.totalFollowers || 0
          } ${followersLabel}`}</Text>
          <Text size="small" color="secondaryText">{`${
            profileData.totalFollowing || 0
          } ${followingLabel}`}</Text>
        </Box>
      </Box>

      <Box direction="column" pad="medium" gap="medium">
        <Text color="primaryText">{profileData.description}</Text>

        {showFollowingButton && loggedEthAddress && (
          <DuplexButton
            inactiveLabel={followLabel}
            activeLabel={followingLabel}
            activeHoverLabel={unfollowLabel}
            onClickInactive={onFollow}
            onClickActive={onUnfollow}
            active={isFollowing}
            icon={<Icon type="following" />}
          />
        )}
      </Box>
    </Box>
  );
};

ProfileMiniCard.defaultProps = {
  followLabel: 'Follow',
  followingLabel: 'Following',
  followersLabel: 'Followers',
  unfollowLabel: 'Unfollow',
  postsLabel: 'Posts',
};

export { ProfileMiniCard };
