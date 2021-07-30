import React from 'react';
import { Box, Text } from 'grommet';

import Icon from '../Icon';
import Avatar from '../Avatar';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { AvatarDiv, StyledInlineBox } from './styled-profile-card';

export interface IProfileDelistedCard {
  className?: string;
  name: string;
  userName: string;
}

const ProfileDelistedCard: React.FC<IProfileDelistedCard> = props => {
  const { className, name, userName } = props;

  return (
    <MainAreaCardBox className={className}>
      <Box
        height="9em"
        background={{
          color: '#EDF0F5',
        }}
        pad="none"
        round={{ corner: 'top', size: 'xsmall' }}
        data-testid="profile-card-cover-image"
      />
      <Box
        direction="column"
        border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }}
        pad={{ bottom: 'medium' }}
        margin={{ horizontal: 'medium' }}
      >
        <Box height="70px" direction="row" justify="between">
          <Box direction="row">
            <AvatarDiv style={{ position: 'relative' }}>
              <Avatar size="xxl" border="xl" faded={true} />
              <Icon
                type="block"
                size="sm"
                style={{ position: 'absolute', right: '0', bottom: '-10.5px' }}
              />
            </AvatarDiv>
            <Box pad={{ vertical: 'xxsmall', left: 'xsmall', right: 'small' }}>
              <StyledInlineBox direction="row" gap="xsmall" align="center">
                <Text size="xlarge" weight="bold" color="primaryText" truncate={true}>
                  {`(${name})`}
                </Text>
              </StyledInlineBox>

              <Box direction="row" gap="xsmall">
                <Text size="medium" color="secondaryText">
                  {userName ? `@${userName.replace('@', '')}` : null}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainAreaCardBox>
  );
};

export { ProfileDelistedCard };
