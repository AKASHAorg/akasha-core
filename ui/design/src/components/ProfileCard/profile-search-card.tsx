import React from 'react';
import { Box, Text } from 'grommet';
import { IProfileData } from '@akashaorg/typings/ui';
import { SearchProfileAvatarDiv, StyledInlineBox } from './styled-profile-card';
import { MainAreaCardBox, StyledAnchor } from '../EntryCard/basic-card-box';
import Avatar from '../Avatar';
import DuplexButton from '../DuplexButton';
import Icon from '../Icon';
import { truncateMiddle } from '../../utils/string-utils';

export interface IProfileSearchCard {
  className?: string;
  loggedEthAddress: string;
  handleFollow: (event: React.SyntheticEvent<Element, Event>) => void;
  handleUnfollow: (event: React.SyntheticEvent<Element, Event>) => void;
  isFollowing: boolean;
  profileData: IProfileData;
  followingLabel: string;
  followersLabel?: string;
  shareProfileLabel?: string;
  followLabel: string;
  unfollowLabel: string;
  postsLabel: string;
  descriptionLabel?: string;
  profileAnchorLink?: string;
  onClickProfile?: () => void;
  showPostCount?: boolean;
}

const ProfileSearchCard: React.FC<IProfileSearchCard> = props => {
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
    showPostCount = true,
  } = props;

  const postsTitle = `${profileData.totalPosts || 0} ${postsLabel}`;

  return (
    <MainAreaCardBox className={className}>
      <Box direction="column" margin="small">
        <Box height="70px" direction="row" justify="between" align="center">
          <StyledAnchor
            onClick={e => {
              e.preventDefault();
              return false;
            }}
            weight="normal"
            href={`${profileAnchorLink}/${profileData.pubKey}`}
            reducedWidth={true}
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
                      {profileData.userName ? `@${profileData.userName.replace('@', '')}` : null}
                      {showPostCount && ` ・ ${postsTitle}`}
                    </Text>
                  </Box>
                </Box>
              </Box>
            }
          />
          {loggedEthAddress !== profileData.ethAddress && (
            <Box>
              <DuplexButton
                inactiveLabel={followLabel}
                activeLabel={followingLabel}
                activeHoverLabel={unfollowLabel}
                onClickActive={handleUnfollow}
                onClickInactive={handleFollow}
                active={isFollowing}
                icon={<Icon type="following" />}
                allowMinimization
              />
            </Box>
          )}
        </Box>
      </Box>
    </MainAreaCardBox>
  );
};

export { ProfileSearchCard };
