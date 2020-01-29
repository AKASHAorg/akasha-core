import { Box, Text } from 'grommet';
import * as React from 'react';
import { Avatar } from '../../Avatar/index';
import { SubtitleTextIcon } from '../../TextIcon/index';
import { BasicCardBox } from '../index';
import { AvatarDiv } from './styled-profile-card';

export interface IProfileData {
  avatar?: string;
  coverImage?: string;
  userName?: string;
  description?: string;
  name?: string;
  url?: string;
  ethAddress: string;
  // app specific
  followers?: string;
  following?: string;
  apps?: string;
  profileType: string;
  users?: string;
  actions?: string;
}

export interface IProfileWidgetCard {
  className?: string;
  onClickApps: React.EventHandler<React.SyntheticEvent>;
  onClickFollowing: React.EventHandler<React.SyntheticEvent>;
  profileData: IProfileData;
  descriptionLabel: string;
  actionsLabel: string;
  followingLabel: string;
  appsLabel: string;
  usersLabel: string;
  shareProfileLabel: string;
}

const ProfileWidgetCard: React.FC<IProfileWidgetCard> = props => {
  const {
    className,
    onClickFollowing,
    onClickApps,
    profileData,
    descriptionLabel,
    actionsLabel,
    followingLabel,
    usersLabel,
    appsLabel,
  } = props;

  const leftLabel = profileData.following ? profileData.following : profileData.users;
  const rightLabel = profileData.apps ? profileData.apps : profileData.actions;
  const leftSubLabel = profileData.profileType === 'dapp' ? usersLabel : followingLabel;
  const rightSubLabel = profileData.profileType === 'dapp' ? actionsLabel : appsLabel;

  return (
    <BasicCardBox className={className}>
      <Box
        height="5.5em"
        background={profileData.coverImage}
        pad="none"
        round={{ corner: 'top', size: 'xsmall' }}
      />
      <Box height="3.5em" direction="row" pad={{ left: '.875em', right: 'medium' }}>
        <AvatarDiv>
          <Avatar
            withBorder={true}
            size="xl"
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
        {leftLabel && rightLabel && (
          <Box pad={{ vertical: 'medium' }} direction="row" alignContent="center" gap="small">
            <SubtitleTextIcon
              iconType="person"
              label={leftLabel}
              labelSize="small"
              subtitle={leftSubLabel}
              onClick={onClickFollowing}
            />
            <SubtitleTextIcon
              iconType="app"
              label={rightLabel}
              labelSize="small"
              subtitle={rightSubLabel}
              onClick={onClickApps}
            />
          </Box>
        )}
      </Box>
      <Box direction="column" pad="medium" gap="medium">
        <Text size="large" weight="bold" color="primaryText">
          {descriptionLabel}
        </Text>
        <Text color="primaryText">{profileData.description}</Text>
      </Box>
    </BasicCardBox>
  );
};

export default ProfileWidgetCard;
