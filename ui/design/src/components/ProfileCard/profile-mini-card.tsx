import { Box, Text } from 'grommet';
import * as React from 'react';
import Avatar from '../Avatar';
import { MiniProfileAvatarDiv } from './styled-profile-card';
import DuplexButton from '../DuplexButton';
import Icon from '../Icon';
import { truncateMiddle } from '../../utils/string-utils';
import { Profile } from '@akashaorg/typings/ui';

export interface IProfileMiniCard {
  // data
  profileData: Profile;
  isFollowing?: boolean;
  // labels
  followLabel?: string;
  followingLabel?: string;
  followersLabel?: string;
  unfollowLabel?: string;
  postsLabel?: string;
  // handlers
  handleClick?: (arg1?: string) => void;
  handleFollow?: (profileId: string) => void;
  handleUnfollow?: (profileId: string) => void;
  disableFollowing?: boolean;
  footerExt?: React.ReactNode;
}

const ProfileMiniCard: React.FC<IProfileMiniCard> = props => {
  const {
    profileData,
    followLabel,
    followingLabel,
    followersLabel,
    unfollowLabel,
    postsLabel,
    handleClick,
    handleFollow,
    handleUnfollow,
    isFollowing,
    disableFollowing,
    footerExt,
  } = props;

  const onFollow = (ev: React.SyntheticEvent) => {
    if (handleFollow) {
      handleFollow(profileData.did.id);
    }
    ev.stopPropagation();
  };

  const onUnfollow = (ev: React.SyntheticEvent) => {
    if (handleUnfollow) {
      handleUnfollow(profileData.did.id);
    }
    ev.stopPropagation();
  };

  const onClick = () => {
    if (handleClick) {
      handleClick(profileData.did.id);
    }
  };

  return (
    <Box
      background="cardBackground"
      round="xsmall"
      direction="column"
      border={{ side: 'all', color: 'border', size: 'xsmall', style: 'solid' }}
      onClick={onClick}
    >
      <Box
        height="4rem"
        background={`url(${profileData.background.default.src})`}
        pad="none"
        round={{ corner: 'top', size: 'xsmall' }}
        align="center"
      >
        <MiniProfileAvatarDiv>
          <Avatar
            border="lg"
            size="xxl"
            avatar={profileData.avatar}
            profileId={profileData.did.id}
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
            {profileData.name || truncateMiddle(profileData.did.id)}
          </Text>
        </Box>
        {/*<Box direction="row" gap="xsmall">*/}
        {/*  <Text size="small" color="secondaryText">{`${*/}
        {/*    profileData.totalPosts || 0*/}
        {/*  } ${postsLabel}`}</Text>*/}
        {/*  <Text size="small" color="secondaryText">{`${*/}
        {/*    profileData.totalFollowers || 0*/}
        {/*  } ${followersLabel}`}</Text>*/}
        {/*  <Text size="small" color="secondaryText">{`${*/}
        {/*    profileData.totalFollowing || 0*/}
        {/*  } ${followingLabel}`}</Text>*/}
        {/*</Box>*/}
      </Box>

      <Box direction="column" pad="medium" gap="medium">
        <Text wordBreak="break-word" color="primaryText" truncate={true}>
          {profileData.description}
        </Text>

        {!disableFollowing && profileData.did.isViewer && (
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
        {footerExt}
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
