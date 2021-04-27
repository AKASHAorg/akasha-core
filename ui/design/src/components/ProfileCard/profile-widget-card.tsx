import { Box, Text } from 'grommet';
import * as React from 'react';
import Avatar from '../Avatar';
import { TextIcon } from '../TextIcon/index';
import { WidgetAreaCardBox } from '../EntryCard/basic-card-box';
import { AvatarDiv } from './styled-profile-card';
import { IProfileData as ProfileDataType } from '@akashaproject/ui-awf-typings/lib/profile';

export interface DefaultProvider {
  property: string;
  provider: string;
  value: any;
}

export interface IProfileData {
  CID?: string;
  avatar?: string;
  coverImage?: string;
  userName?: string;
  description?: string;
  name?: string;
  url?: string;
  ensName?: string;
  ethAddress: string;
  pubKey: string;
  totalPosts?: string | number;
  totalFollowers?: string | number;
  totalFollowing?: string | number;
  default: DefaultProvider[];
  // app specific
  apps?: string | number;
  profileType?: string;
  users?: string | number;
  actions?: string;
}

export interface IProfileWidgetCard {
  className?: string;
  loggedEthAddress?: string | null;
  onClickProfile?: React.EventHandler<React.SyntheticEvent>;
  onClickFollowers?: React.EventHandler<React.SyntheticEvent>;
  onClickFollowing?: React.EventHandler<React.SyntheticEvent>;
  onClickPosts?: React.EventHandler<React.SyntheticEvent>;
  handleUnfollow?: React.EventHandler<React.SyntheticEvent>;
  handleFollow?: React.EventHandler<React.SyntheticEvent>;
  isFollowing?: boolean;
  profileData: ProfileDataType;
  descriptionLabel: string;
  postsLabel: string;
  followingLabel: string;
  followersLabel: string;
  followLabel?: string;
  unfollowLabel?: string;
  shareProfileLabel: string;
  // anchor link
  profileAnchorLink?: string;
}

const ProfileWidgetCard: React.FC<IProfileWidgetCard> = props => {
  const {
    className,
    onClickFollowing,
    onClickFollowers,
    onClickPosts,
    profileData,
    descriptionLabel,
    followingLabel,
    followersLabel,
    postsLabel,
  } = props;

  const postsTitle = `${profileData.totalPosts} ${postsLabel}`;
  const followersTitle = `${profileData.totalFollowers} ${followersLabel}`;
  const followingTitle = `${profileData.totalFollowing} ${followingLabel}`;

  return (
    <WidgetAreaCardBox className={className}>
      <Box
        height="5.5em"
        background={profileData.coverImage}
        pad="none"
        round={{ corner: 'top', size: 'xsmall' }}
      />
      <Box height="3.5em" direction="row" pad={{ left: '.875em', right: 'medium' }}>
        <AvatarDiv>
          <Avatar
            border="lg"
            size="xxl"
            src={profileData.avatar}
            ethAddress={profileData.ethAddress}
          />
        </AvatarDiv>

        <Box pad={{ vertical: 'small', left: 'xsmall' }}>
          <Text size="xlarge" weight="bold" color="primaryText">
            {profileData.name}
          </Text>
          <Text size="medium" color="secondaryText">
            {profileData.userName ? profileData.userName : profileData.ethAddress}
          </Text>
        </Box>
      </Box>
      <Box
        height="4.5em"
        border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }}
        margin={{ horizontal: 'medium' }}
        direction="row"
        justify="between"
      >
        <Box pad="medium" direction="row" alignContent="center" gap="medium">
          <TextIcon
            iconType="quote"
            label={postsTitle}
            onClick={onClickPosts}
            data-testid="posts-button"
          />
          <TextIcon
            iconType="following"
            label={followingTitle}
            onClick={onClickFollowing}
            data-testid="following-button"
          />
          <TextIcon
            iconType="following"
            label={followersTitle}
            onClick={onClickFollowers}
            data-testid="followers-button"
          />
        </Box>
      </Box>
      <Box direction="column" pad="medium" gap="medium">
        <Text size="large" weight="bold" color="primaryText">
          {descriptionLabel}
        </Text>
        <Text color="primaryText">{profileData.description}</Text>
      </Box>
    </WidgetAreaCardBox>
  );
};

export { ProfileWidgetCard };
