import * as React from 'react';
import { Box, Text } from 'grommet';
import { IUser } from './entry-box';
import { StackedAvatar } from '../../Avatar/index';

export interface ISocialData {
  users: IUser[];
}

export interface ISocialBox {
  socialData: ISocialData;
  // labels
  repostedThisLabel?: string;
  andLabel?: string;
  othersLabel?: string;
}

const SocialBox: React.FC<ISocialBox> = props => {
  const { socialData, andLabel, othersLabel, repostedThisLabel } = props;

  const avatarUserData = socialData.users.map(user => {
    return { ethAddress: user.ethAddress, avatar: user.avatar };
  });
  return (
    <Box
      direction="row"
      gap="xxsmall"
      pad="medium"
      border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }}
    >
      {avatarUserData && <StackedAvatar userData={avatarUserData} maxAvatars={3} />}
      <Text>
        {socialData.users[0].userName
          ? socialData?.users[0].userName
          : socialData?.users[0].ethAddress}
      </Text>
      {socialData.users.length > 1 ? (
        <Box direction="row" gap="xxsmall">
          <Text color="secondaryText">{andLabel}</Text>
          <Text>{`${socialData.users.length} ${othersLabel}`}</Text>
          <Text color="secondaryText">{repostedThisLabel}</Text>
        </Box>
      ) : (
        <Text color="secondaryText">{repostedThisLabel}</Text>
      )}
    </Box>
  );
};

SocialBox.defaultProps = {
  repostedThisLabel: 'reposted this',
  andLabel: 'and',
  othersLabel: 'others',
};

export { SocialBox };
