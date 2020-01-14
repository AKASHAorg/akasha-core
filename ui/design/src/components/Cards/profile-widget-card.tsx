import { Box, Text } from 'grommet';
import * as React from 'react';
import { Avatar } from '../Avatar/index';
import { SubtitleTextIcon } from '../TextIcon/index';
import { BasicCardBox } from './index';
import { IProfileCardProps } from './profile-card';
import { AvatarDiv } from './styled-profile-card';

export type IProfileWidgetCard = Omit<IProfileCardProps, 'onChangeProfileData'>;

const ProfileWidgetCard: React.FC<IProfileWidgetCard> = props => {
  const {
    className,
    onClickFollowing,
    onClickApps,
    profileData,
    descriptionTitle,
    actionsTitle,
    followingTitle,
    usersTitle,
    appsTitle,
  } = props;

  const leftTitle = profileData.following ? profileData.following : profileData.users;
  const rightTitle = profileData.apps ? profileData.apps : profileData.actions;
  const leftSubtitle = profileData.profileType === 'dapp' ? usersTitle : followingTitle;
  const rightSubtitle = profileData.profileType === 'dapp' ? actionsTitle : appsTitle;

  const isGuest = !profileData.ethAddress;
  return (
    <BasicCardBox className={className}>
      <Box
        height="88px"
        background={profileData.coverImage}
        pad="none"
        round={{ corner: 'top', size: 'xsmall' }}
      />
      <Box height="56px" direction="row" pad={{ left: '14px', right: 'medium' }}>
        <AvatarDiv>
          <Avatar
            withBorder={true}
            guest={isGuest}
            size="xl"
            src={profileData.avatar || profileData.ethAddress}
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
        height="72px"
        border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }}
        margin={{ horizontal: 'medium' }}
        direction="row"
        justify="between"
      >
        {leftTitle && rightTitle && (
          <Box pad={{ vertical: 'medium' }} direction="row" alignContent="center" gap="small">
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
      <Box direction="column" pad="medium" gap="medium">
        <Text size="large" weight="bold" color="primaryText">
          {descriptionTitle}
        </Text>
        <Text color="primaryText">{profileData.description}</Text>
      </Box>
    </BasicCardBox>
  );
};

export default ProfileWidgetCard;
