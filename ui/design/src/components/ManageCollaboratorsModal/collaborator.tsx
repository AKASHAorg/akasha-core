import React from 'react';
import { Box, Text, ThemeContext } from 'grommet';

import Avatar from '../Avatar';
import Button from '../Button';
import { Profile } from '@akashaorg/typings/ui';

export interface ICollaboratorProps {
  profile: Profile;
  isRed?: boolean;
  buttonLabel: string;
  onClick: () => void;
}

const Collaborator: React.FC<ICollaboratorProps> = props => {
  const { profile, isRed = false, buttonLabel, onClick } = props;

  const theme: any = React.useContext(ThemeContext);

  return (
    <Box direction="row" fill="horizontal" justify="between" align="center">
      <Box direction="row" gap="xsmall" align="center">
        <Avatar size="md" avatar={profile.avatar} />
        <Box>
          <Text size="large">{profile.name}</Text>
          {/*<Text size="small" color="secondaryText">*/}
          {/*  {value.userName}*/}
          {/*</Text>*/}
        </Box>
      </Box>
      <Button
        size="large"
        height={2.5}
        slimBorder={true}
        label={buttonLabel}
        style={{
          color: isRed ? theme.colors.errorText : theme.colors.accentText,
          borderColor: isRed ? theme.colors.errorText : theme.colors.accentText,
        }}
        onClick={onClick}
      />
    </Box>
  );
};

export default Collaborator;
