import React from 'react';
import { Box, Text } from 'grommet';

import { IProfileWidgetCard } from './profile-widget-card';
import { SearchProfileAvatarDiv, StyledInlineBox } from './styled-profile-card';

import { MainAreaCardBox, StyledAnchor } from '../EntryCard/basic-card-box';
import Avatar from '../Avatar';
import DuplexButton from '../DuplexButton';
import { Icon } from '../Icon';
import { truncateMiddle } from '../../utils/string-utils';

const ProfileSearchCard: React.FC<IProfileWidgetCard> = props => {
  const {
    className,
    loggedEthAddress,
    handleFollow,
    handleUnfollow,
    isFollowing,
    profileData,
    followingLabel,
    followLabel,
    unfollowLabel,
    postsLabel,
    profileAnchorLink,
    onClickProfile,
  } = props;

  const postsTitle = `${profileData.totalPosts || 0} ${postsLabel}`;

  return (
    <MainAreaCardBox className={className}>
      <Box direction="column" margin="small">
        <Box height="70px" direction="row" justify="between">
          <StyledAnchor
            onClick={e => {
              e.preventDefault();
              return false;
            }}
            weight="normal"
            href={`${profileAnchorLink}/${profileData.pubKey}`}
            label={
              <Box direction="row" align="center" onClick={onClickProfile}>
                <SearchProfileAvatarDiv>
                  <Avatar
                    border="lg"
                    size="xl"
                    src={profileData.avatar}
                    ethAddress={profileData.ethAddress}
                  />
                </SearchProfileAvatarDiv>
                <Box pad={{ vertical: 'xxsmall', left: 'xxsmall', right: 'small' }}>
                  <StyledInlineBox direction="row" gap="xsmall" align="center">
                    <Text size="xlarge" weight="bold" color="primaryText" truncate={true}>
                      {profileData.name || truncateMiddle(profileData.ethAddress)}
                    </Text>
                  </StyledInlineBox>
                  <Box direction="row" gap="xsmall">
                    <Text size="medium" color="secondaryText">
                      {profileData.userName ? `@${profileData.userName.replace('@', '')}` : null}・
                      {postsTitle}
                    </Text>
                  </Box>
                </Box>
              </Box>
            }
          />
          <Box direction="row" align="center" gap="small" flex={{ shrink: 0 }}>
            {loggedEthAddress !== profileData.ethAddress && (
              <Box width="7rem" margin={{ right: 'xxsmall' }}>
                <DuplexButton
                  icon={<Icon type="following" />}
                  active={isFollowing}
                  activeLabel={followingLabel}
                  inactiveLabel={followLabel}
                  activeHoverLabel={unfollowLabel}
                  onClickActive={handleUnfollow}
                  onClickInactive={handleFollow}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </MainAreaCardBox>
  );
};

export default ProfileSearchCard;
