import * as React from 'react';
import { Box, Text } from 'grommet';

import Icon from '../../Icon';

export type IProfileCardBadgesProps = {
  badgesLabel: string;
  badges?: string[];
};

const ProfileCardBadges: React.FC<IProfileCardBadgesProps> = props => {
  const { badgesLabel, badges } = props;

  return (
    <Box
      direction="column"
      pad={{ vertical: 'xsmall', horizontal: 'medium' }}
      gap="xxsmall"
      margin={{ bottom: 'medium' }}
    >
      <Box direction="row" gap="xxsmall" align="center">
        <Text size="large" weight="bold" color="primaryText" style={{ lineHeight: 1.7 }}>
          {badgesLabel}
        </Text>
      </Box>
      <Box direction="row" gap="small">
        {badges.map((badge: string, id: number) => (
          <Icon
            key={badge + id}
            type={badge}
            strokeWidth={0}
            style={{ height: '3.4375rem', width: '3.4375rem' }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ProfileCardBadges;
