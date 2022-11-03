import { Text } from 'grommet';
import * as React from 'react';
import { LogoSourceType } from '@akashaorg/typings/ui';
import { StyledInlineBox } from '../styled-profile-card';

export type IProfileCardNameProps = {
  name?: string;
  nameIcon?: LogoSourceType;
};

const ProfileCardName: React.FC<IProfileCardNameProps> = props => {
  const { name } = props;

  return (
    <>
      <StyledInlineBox direction="row" gap="xsmall" align="center">
        <Text size="xlarge" weight="bold" color="primaryText" truncate={true}>
          {name}
        </Text>
      </StyledInlineBox>
    </>
  );
};

export default ProfileCardName;
