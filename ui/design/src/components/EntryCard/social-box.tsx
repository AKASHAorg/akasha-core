import * as React from 'react';
import { Box, Text } from 'grommet';
import Avatar from '../Avatar';
import { StyledDrop, StyledSelectBox } from './styled-entry-box';
import { truncateMiddle } from '../../utils/string-utils';
import IconLink from '../IconLink';
import styled from 'styled-components';
import { Profile } from '@akashaorg/typings/ui';

export interface ISocialBox {
  socialData: Profile[];
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
        {socialData.slice(1).map((user, index) => (
          <StyledSelectBox
            direction="row"
            gap="xsmall"
            align="center"
            key={index}
            pad="xxsmall"
            flex={{ shrink: 0 }}
          >
            <Avatar
              avatar={user.avatar}
              profileId={user.did.id}
              size="xs"
              onClick={() => {
                if (onClickUser) {
                  onClickUser(user.did.id);
                }
              }}
            />
            <Text
              onClick={() => {
                if (onClickUser) {
                  onClickUser(user.did.id);
                }
              }}
            >
              {user.name || truncateMiddle(user.did.id, 3, 3)}
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
      {socialData.length && (
        <Avatar
          avatar={socialData[0].avatar}
          profileId={socialData[0].did.id}
          size="xs"
          onClick={() => {
            if (onClickUser) {
              onClickUser(socialData[0].did.id);
            }
          }}
        />
      )}
      <IconLink
        onClick={() => {
          if (onClickUser) {
            onClickUser(socialData[0].did.id);
          }
        }}
        label={socialData[0].name || truncateMiddle(socialData[0]?.did.id, 3, 3)}
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
