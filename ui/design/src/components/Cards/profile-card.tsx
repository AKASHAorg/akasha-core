import { Box, Image, Text } from 'grommet';
import * as React from 'react';
import MarginInterface from '../../interfaces/margin.interface';
import Avatar from '../Avatar/index';
import { Icon } from '../Icon';
import IconButton from '../IconButton/icon-button';
import { SubtitleTextIcon, TextIcon } from '../TextIcon/index';
import { IActionType } from '../TextIcon/text-icon';
import { BasicCardBox } from './index';
import { AvatarDiv, ShareButtonContainer } from './styled-profile-card';

export interface IProfileData {
  avatarImg?: string;
  profileImg?: string;
  userName: string;
  userInfo?: string;
  name?: string;
  followers?: string;
  following?: string;
  apps?: string;
  profileType: string;
  users?: string;
  actions?: string;
  mostPopularActions?: IActionType[];
}

export interface IProfileCardProps {
  onClickApps: React.EventHandler<React.SyntheticEvent>;
  onClickFollowing: React.EventHandler<React.SyntheticEvent>;
  margin?: MarginInterface;
  profileData: IProfileData;
  userInfoTitle: string;
  actionsTitle: string;
  followingTitle: string;
  appsTitle: string;
  usersTitle: string;
  mostPopularActionsTitle: string;
  shareProfileText: string;
}

const ProfileCard: React.FC<IProfileCardProps> = props => {
  const {
    onClickFollowing,
    onClickApps,
    profileData,
    userInfoTitle,
    actionsTitle,
    followingTitle,
    usersTitle,
    mostPopularActionsTitle,
    shareProfileText,
    appsTitle,
  } = props;

  const leftTitle = profileData.following ? profileData.following : profileData.users;
  const rightTitle = profileData.apps ? profileData.apps : profileData.actions;
  const leftSubtitle = profileData.profileType === 'dapp' ? usersTitle : followingTitle;
  const rightSubtitle = profileData.profileType === 'dapp' ? actionsTitle : appsTitle;

  return (
    <BasicCardBox>
      <Box
        height="144px"
        background={profileData.profileImg}
        pad="none"
        round={{ corner: 'top', size: 'xsmall' }}
        align="end"
      >
        <ShareButtonContainer>
          <IconButton share={true} icon={<Icon type="share" />} label={shareProfileText} />
        </ShareButtonContainer>
      </Box>
      <Box
        height="70px"
        border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }}
        margin={{ horizontal: 'medium' }}
        direction="row"
        justify="between"
      >
        <Box direction="row">
          <AvatarDiv>
            {profileData.avatarImg && (
              <Image
                src={profileData.avatarImg}
                fit="cover"
                width="76px"
                height="76px"
                style={{ borderRadius: '100%' }}
              />
            )}
          </AvatarDiv>
          <Box pad={{ vertical: 'small', left: 'xsmall' }}>
            <Text size="xlarge" weight="bold" color="primaryText">
              {profileData.name}
            </Text>
            <Text size="medium" color="secondaryText">
              {profileData.userName}
            </Text>
          </Box>
        </Box>
        {leftTitle && rightTitle && (
          <Box
            pad={{ vertical: 'medium', right: 'xxsmall' }}
            direction="row"
            alignContent="center"
            gap="small"
          >
            <SubtitleTextIcon
              iconType="person"
              label={leftTitle}
              labelSize="small"
              subtitle={leftSubtitle}
              onClick={onClickFollowing}
            />
            <SubtitleTextIcon
              iconType="app"
              label={rightTitle}
              labelSize="small"
              subtitle={rightSubtitle}
              onClick={onClickApps}
            />
          </Box>
        )}
      </Box>
      {profileData.profileType === 'dapp' && profileData.mostPopularActions && (
        <Box direction="column" pad={{ horizontal: 'medium', top: 'medium' }} gap="medium">
          <Text size="large" weight="bold" color="primaryText">
            {mostPopularActionsTitle}
          </Text>
          <Box pad="none" gap="medium" direction="row">
            {profileData.mostPopularActions.map((action, index) => (
              <TextIcon
                actionType={action}
                key={index}
                label={action}
                iconType={'app'}
                clickable={true}
              />
            ))}
          </Box>
        </Box>
      )}
      <Box direction="column" pad="medium" gap="medium">
        <Text size="large" weight="bold" color="primaryText">
          {userInfoTitle}
        </Text>
        <Text color="primaryText">{profileData.userInfo}</Text>
      </Box>
    </BasicCardBox>
  );
};

export default ProfileCard;
