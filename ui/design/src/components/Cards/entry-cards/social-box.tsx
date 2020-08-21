import * as React from 'react';
import { Box, Text } from 'grommet';
import { IProfileData } from '../profile-cards/profile-widget-card';
import { StackedAvatar, Avatar } from '../../Avatar/index';
import { StyledDrop, StyledSelectBox } from './styled-entry-box';
import { truncateMiddle } from '../../../utils/string-utils';
import { IconLink } from '../../Buttons';

export interface ISocialData {
  users: IProfileData[];
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
    return { ethAddress: user.ethAddress, avatar: user.avatar, userName: user.userName };
  });
  const othersNodeRef: React.Ref<any> = React.useRef(null);
  const [othersDropOpen, setOthersDropOpen] = React.useState(false);

  const renderOthersDrop = () => (
    <StyledDrop
      overflow="hidden"
      target={othersNodeRef.current}
      align={{ top: 'bottom', left: 'left' }}
      onClickOutside={() => setOthersDropOpen(false)}
      onEsc={() => setOthersDropOpen(false)}
    >
      <Box
        pad={{ vertical: 'xxsmall', left: 'xxsmall', right: 'xsmall' }}
        height={{ max: '8rem' }}
        overflow="auto"
      >
        {avatarUserData.slice(1).map((user, index) => (
          <StyledSelectBox
            direction="row"
            gap="xsmall"
            align="center"
            key={index}
            pad="xxsmall"
            flex={{ shrink: 0 }}
          >
            <Avatar src={user.avatar} size="xs" />
            <Text>{user.userName ? user.userName : truncateMiddle(user.ethAddress, 3, 3)}</Text>
          </StyledSelectBox>
        ))}
      </Box>
    </StyledDrop>
  );

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
          : truncateMiddle(socialData?.users[0].ethAddress, 3, 3)}
      </Text>
      {socialData.users.length > 1 ? (
        <Box direction="row" gap="xxsmall">
          <Text color="secondaryText">{andLabel}</Text>

          <IconLink
            label={`${socialData.users.length - 1} ${othersLabel}`}
            size="medium"
            ref={othersNodeRef}
            onClick={() => setOthersDropOpen(!othersDropOpen)}
            primaryColor={true}
          />

          <Text color="secondaryText">{repostedThisLabel}</Text>
        </Box>
      ) : (
        <Text color="secondaryText">{repostedThisLabel}</Text>
      )}
      {othersNodeRef.current && othersDropOpen && renderOthersDrop()}
    </Box>
  );
};

SocialBox.defaultProps = {
  repostedThisLabel: 'reposted this',
  andLabel: 'and',
  othersLabel: 'others',
};

export { SocialBox };
