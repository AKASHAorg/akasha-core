import * as React from 'react';
import { Box, Text } from 'grommet';
import { IProfileData } from '../profile-cards/profile-widget-card';
import Avatar from '../../Avatar';
import { StyledDrop, StyledSelectBox } from './styled-entry-box';
import { truncateMiddle } from '../../../utils/string-utils';
import IconLink from '../../IconLink';
import styled from 'styled-components';

export type ISocialData = IProfileData[];

export interface ISocialBox {
  socialData: ISocialData;
  onClickUser?: (ethAddress: string) => void;
  // labels
  repostedThisLabel?: string;
  andLabel?: string;
  othersLabel?: string;
}

const StackableAvatarLink = styled(IconLink)`
  max-width: 100%;
  flex-shrink: 1;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SocialBox: React.FC<ISocialBox> = props => {
  const { socialData, andLabel, othersLabel, repostedThisLabel, onClickUser } = props;

  const avatarUserData = socialData.map(user => {
    return {
      pubKey: user.pubKey,
      ethAddress: user.ethAddress,
      avatar: user.avatar,
      userName: user.userName,
      name: user.name,
    };
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
            <Avatar
              src={user.avatar}
              ethAddress={user.ethAddress}
              size="xs"
              onClick={() => {
                if (onClickUser) {
                  onClickUser(user.pubKey);
                }
              }}
            />
            <Text
              onClick={() => {
                if (onClickUser) {
                  onClickUser(user.pubKey);
                }
              }}
            >
              {user.name || user.userName || truncateMiddle(user.ethAddress, 3, 3)}
            </Text>
          </StyledSelectBox>
        ))}
      </Box>
    </StyledDrop>
  );

  return (
    <Box
      direction="row"
      align="center"
      gap="xxsmall"
      pad={{ horizontal: 'medium', vertical: 'small' }}
      border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }}
    >
      {avatarUserData && (
        <Avatar
          src={avatarUserData[0].avatar}
          ethAddress={avatarUserData[0].ethAddress}
          size="xs"
          onClick={() => {
            if (onClickUser) {
              onClickUser(avatarUserData[0].pubKey);
            }
          }}
        />
      )}
      <IconLink
        onClick={() => {
          if (onClickUser) {
            onClickUser(socialData[0].pubKey);
          }
        }}
        label={
          socialData[0].name ||
          socialData[0].userName ||
          truncateMiddle(socialData[0]?.ethAddress, 3, 3)
        }
        size="medium"
        primaryColor={true}
      />

      {socialData.length > 1 ? (
        <Box direction="row" gap="xxsmall">
          <Text color="secondaryText">{andLabel}</Text>

          <StackableAvatarLink
            label={`${socialData?.length - 1} ${othersLabel}`}
            size="medium"
            ref={othersNodeRef}
            onClick={() => setOthersDropOpen(!othersDropOpen)}
            primaryColor={true}
          />

          <Text style={{ flexShrink: 0 }} color="secondaryText">
            {repostedThisLabel}
          </Text>
        </Box>
      ) : (
        <Text style={{ flexShrink: 0 }} color="secondaryText">
          {repostedThisLabel}
        </Text>
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
