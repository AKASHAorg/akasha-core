import { Box, Text } from 'grommet';
import * as React from 'react';
import { Avatar } from '../../Avatar/index';
import { AvatarDiv, StyledMiniCardBox } from './styled-profile-card';
import { Button } from '../../Buttons';
import { Icon } from '../../Icon';

export interface IProfileData {
  avatar?: string;
  coverImage?: string;
  userName?: string;
  description?: string;
  ensName?: string;
  ethAddress: string;
  postsNumber: number;
}

export interface IProfileMiniCard {
  onClickFollow: (profileEthAddress: string) => void;
  profileData: IProfileData;
  followLabel?: string;
  postsLabel?: string;
}

const ProfileMiniCard: React.FC<IProfileMiniCard> = props => {
  const { onClickFollow, profileData, followLabel, postsLabel } = props;

  return (
    <StyledMiniCardBox round="xsmall" direction="column">
      <Box
        height="4rem"
        background={profileData.coverImage}
        pad="none"
        round={{ corner: 'top', size: 'xsmall' }}
      />
      <Box height="3.5rem" direction="row" align="center" justify="center">
        <AvatarDiv>
          <Avatar
            border="lg"
            size="xl"
            src={profileData.avatar}
            ethAddress={profileData.ethAddress}
          />
        </AvatarDiv>

        <Box pad={{ vertical: 'small', left: 'xsmall' }}>
          <Text size="xlarge" weight="bold" color="primaryText">
            {profileData.userName ? profileData.userName : profileData.ethAddress}
          </Text>
          <Box direction="row" gap="xsmall">
            {profileData.ensName && (
              <Text size="medium" color="secondaryText">
                {profileData.ensName}
              </Text>
            )}
            <Text>{`${profileData.postsNumber} ${postsLabel}`}</Text>
          </Box>
        </Box>
      </Box>

      <Box direction="column" pad="medium" gap="medium">
        <Text color="primaryText">{profileData.description}</Text>
      </Box>
      <Button
        label={followLabel}
        onClick={onClickFollow}
        icon={<Icon type="person" clickable={true} primaryColor={true} />}
      />
    </StyledMiniCardBox>
  );
};

ProfileMiniCard.defaultProps = {
  followLabel: 'Follow',
};

export { ProfileMiniCard };
