import * as React from 'react';
import MarginInterface from '../../interfaces/margin.interface';
import { Box, Text, Image } from 'grommet';
import Icon, { IconType } from '../Icon/index';
import Avatar from '../Avatar/index';
import styled from 'styled-components';

interface IProfileData {
  avatarImg: string;
  profileImg: string;
  userName: string;
  userInfo: string;
  name: string;
  followers: number;
  following: number;
  apps: number;
}

export interface ICardWidgetProps {
  onClick: React.EventHandler<React.SyntheticEvent>;
  margin?: MarginInterface;
  profileData: IProfileData;
  aboutMeTitle: string;
  followingTitle: string;
  appsTitle: string;
}

const AvatarDiv = styled.div`
  box-sizing: border-box;
  border-radius: 100%;
  height: 84px;
  width: 84px;
  border: 4px solid #fff;
  transform: translateY(-30px);
  background-color: darkGrey;
`;

const IconDiv = styled.div`
  border-radius: 14px;
  width: 28px;
  height: 28px;
  background: ${props => props.theme.colors.background};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileCard: React.FC<ICardWidgetProps> = props => {
  const { onClick, margin, profileData, aboutMeTitle, followingTitle, appsTitle } = props;

  return (
    <Box
      direction="column"
      elevation="styleGuideShadow"
      fill
      pad="none"
      round="8px"
      border={{
        color: 'border',
        size: 'xsmall',
        style: 'solid',
        side: 'all',
      }}
    >
      <Box
        basis="1/3"
        background={profileData.profileImg}
        pad="none"
        round={{ corner: 'top', size: '8px' }}
      />
      <Box
        basis="1/4"
        border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }}
        margin={{ horizontal: '16px' }}
        direction="row"
        justify="between"
      >
        <Box direction="row">
          <AvatarDiv>
            <Image
              src={profileData.avatarImg}
              fit="cover"
              width="76px"
              height="76px"
              style={{ borderRadius: '100%' }}
            />
          </AvatarDiv>
          <Box pad={{ vertical: '16px', left: '8px' }}>
            <Text size="15px" weight="bold" color="darkGrey">
              {profileData.name}
            </Text>
            <Text size="13px" color="background">
              {profileData.userName}
            </Text>
          </Box>
        </Box>

        <Box pad={{ vertical: '16px', right: '4px' }} direction="row" alignContent="center">
          <Box direction="row" justify="center" pad={{ right: '20px' }}>
            <IconDiv>
              <Icon type="person" />
            </IconDiv>
            <Box pad={{ left: '8px' }}>
              <Text>{profileData.following}</Text>
              <Text size="11px" color="background">
                {followingTitle}
              </Text>
            </Box>
          </Box>
          <Box direction="row" justify="center">
            <IconDiv>
              <Icon type="app" />
            </IconDiv>
            <Box pad={{ left: '8px' }}>
              <Text>{profileData.apps}</Text>
              <Text size="11px" color="background">
                {appsTitle}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box direction="column" pad="16px" gap="16px">
        <Text size="15px" weight="bold">
          {aboutMeTitle}
        </Text>
        <Text>{profileData.userInfo}</Text>
      </Box>
    </Box>
  );
};

const defaultProps = {};

ProfileCard.defaultProps = defaultProps;

export default ProfileCard;
