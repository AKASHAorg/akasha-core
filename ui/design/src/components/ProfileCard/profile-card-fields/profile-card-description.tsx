import { Box, Text } from 'grommet';
import * as React from 'react';

export type IProfileCardDescriptionProps = {
  descriptionLabel: string;
  description?: string;
};

const ProfileCardDescription: React.FC<IProfileCardDescriptionProps> = props => {
  const { description, descriptionLabel } = props;

  return (
    <>
      <Box direction="column" pad={{ vertical: 'xsmall', horizontal: 'medium' }} gap="xxsmall">
        <Box direction="row" gap="xxsmall" align="center">
          <Text size="large" weight="bold" color="primaryText" style={{ lineHeight: 1.7 }}>
            {descriptionLabel}
          </Text>
        </Box>

        <Text color="primaryText" size="large" style={{ lineHeight: 1.7 }} wordBreak="break-word">
          {description}
        </Text>
      </Box>
    </>
  );
};

export default ProfileCardDescription;
