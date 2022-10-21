import * as React from 'react';
import { Box, Image, Text } from 'grommet';

export interface IProfileCardBadgesProps {
  publicImgPath?: string;
  badgesLabel: string;
  badges?: string[];
}

const ProfileCardBadges: React.FC<IProfileCardBadgesProps> = props => {
  const { publicImgPath = '/images', badgesLabel, badges } = props;

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
          <Box key={badge + id} height="3.5rem" width="3.5rem">
            {/* badges are in webp formats */}
            <Image fit="contain" src={`${publicImgPath}/${badge}.webp`} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProfileCardBadges;
