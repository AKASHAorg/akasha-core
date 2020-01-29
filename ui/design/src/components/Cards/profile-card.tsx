import { Box, Text } from 'grommet';
import * as React from 'react';
import MarginInterface from '../../interfaces/margin.interface';
import { Avatar, EditableAvatar } from '../Avatar/index';
import { SubtitleTextIcon, TextIcon } from '../TextIcon/index';
import { IActionType } from '../TextIcon/text-icon';
import { BasicCardBox } from './index';
import {
  ProfileCardCoverImage,
  ProfileCardDescription,
  ProfileCardName,
} from './profile-card-fields';
import { AvatarDiv } from './styled-profile-card';

export interface IProfileData {
  avatar?: string;
  coverImage?: string;
  userName?: string;
  description?: string;
  name?: string;
  email?: string;
  url?: string;
  address?: string;
  ethAddress: string;
  // app specific
  followers?: string;
  following?: string;
  apps?: string;
  profileType: string;
  users?: string;
  actions?: string;
  mostPopularActions?: IActionType[];
  vnd: { [key: string]: string };
}

export interface IProfileCardProps {
  className?: string;
  onClickApps: React.EventHandler<React.SyntheticEvent>;
  onClickFollowing: React.EventHandler<React.SyntheticEvent>;
  onChangeProfileData: (newProfileData: IProfileData) => void;
  margin?: MarginInterface;
  profileData: IProfileData;
  descriptionTitle: string;
  actionsTitle: string;
  followingTitle: string;
  appsTitle: string;
  usersTitle: string;
  mostPopularActionsTitle: string;
  shareProfileText: string;
  canEdit?: boolean;
}

const ProfileCard: React.FC<IProfileCardProps> = props => {
  const {
    className,
    onClickFollowing,
    onClickApps,
    onChangeProfileData,
    profileData,
    descriptionTitle,
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

  const [editable] = React.useState(false);

  const handleAvatarChange = (newValue: string) =>
    onChangeProfileData({
      ...profileData,
      avatar: newValue,
    });

  return (
    <BasicCardBox className={className}>
      <ProfileCardCoverImage
        shareProfileText={shareProfileText}
        profileData={profileData}
        editable={editable}
        onChangeProfileData={onChangeProfileData}
      />
      <Box
        height="4.375em"
        border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }}
        margin={{ horizontal: 'medium' }}
        direction="row"
        justify="between"
      >
        <Box direction="row">
          <AvatarDiv>
            {props.canEdit && (
              <EditableAvatar
                size="xl"
                withBorder={true}
                src={profileData.avatar || profileData.ethAddress}
                guest={!!profileData.avatar}
                onChange={handleAvatarChange}
              />
            )}
            {!props.canEdit && (
              <Avatar
                size="xl"
                withBorder={true}
                src={profileData.avatar || profileData.ethAddress}
                guest={!!profileData.avatar}
              />
            )}
          </AvatarDiv>

          <Box pad={{ vertical: 'small', left: 'xsmall' }}>
            <ProfileCardName
              profileData={profileData}
              editable={editable}
              onChangeProfileData={onChangeProfileData}
            />

            <Text
              size="medium"
              color="secondaryText"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {profileData.userName ? profileData.userName : profileData.ethAddress}
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
              data-testid="following-button"
            />
            <SubtitleTextIcon
              iconType="app"
              label={rightTitle}
              labelSize="small"
              subtitle={rightSubtitle}
              onClick={onClickApps}
              data-testid="apps-button"
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
          {descriptionTitle}
        </Text>

        <ProfileCardDescription
          profileData={profileData}
          editable={editable}
          onChangeProfileData={onChangeProfileData}
        />
      </Box>
    </BasicCardBox>
  );
};

export default ProfileCard;
