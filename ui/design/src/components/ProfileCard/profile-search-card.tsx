import React from 'react';
import { Box, Text } from 'grommet';
import { SearchProfileAvatarDiv, StyledInlineBox } from './styled-profile-card';
import { MainAreaCardBox, StyledAnchor } from '../EntryCard/basic-card-box';
import Avatar from '../Avatar';
import DuplexButton from '../DuplexButton';
import Icon from '../Icon';
import { truncateMiddle } from '../../utils/string-utils';
import { Profile } from '@akashaorg/typings/ui';

export interface IProfileSearchCard {
  className?: string;
  handleFollow: (event: React.SyntheticEvent<Element, Event>) => void;
  handleUnfollow: (event: React.SyntheticEvent<Element, Event>) => void;
  isFollowing: boolean;
  profileData: Profile;
  followingLabel: string;
  followersLabel?: string;
  shareProfileLabel?: string;
  followLabel: string;
  unfollowLabel: string;
  descriptionLabel?: string;
  profileAnchorLink?: string;
  onClickProfile?: () => void;
  showPostCount?: boolean;
  isViewer?: boolean;
}

const ProfileSearchCard: React.FC<IProfileSearchCard> = props => {
  const {
    className,
    handleFollow,
    handleUnfollow,
    isFollowing,
    profileData,
    followingLabel,
    followLabel,
    unfollowLabel,
    isViewer,
    profileAnchorLink,
    onClickProfile,
    showPostCount = true,
  } = props;

  // const postsTitle = `${profileData.totalPosts || 0} ${postsLabel}`;

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
            href={`${profileAnchorLink}/${profileData.did.id}`}
            reducedWidth={true}
            label={
              <Box direction="row" align="center" onClick={onClickProfile}>
                <SearchProfileAvatarDiv>
                  <Avatar
                    border="lg"
                    size="xl"
                    avatar={profileData.avatar}
                    profileId={profileData.did.id}
                  />
                </SearchProfileAvatarDiv>
                <Box pad={{ vertical: 'xxsmall', left: 'xxsmall', right: 'small' }}>
                  <StyledInlineBox direction="row" gap="xsmall" align="center">
                    <Text size="xlarge" weight="bold" color="primaryText" truncate={true}>
                      {profileData.name || truncateMiddle(profileData.did.id)}
                    </Text>
                  </StyledInlineBox>
                  <Box direction="row" gap="xsmall">
                    {/*<Text size="medium" color="secondaryText">*/}
                    {/*  {profileData.userName ? `@${profileData.userName.replace('@', '')}` : null}*/}
                    {/*  {showPostCount && ` ・ ${postsTitle}`}*/}
                    {/*</Text>*/}
                  </Box>
                </Box>
              </Box>
            }
          />
          {!isViewer && (
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
