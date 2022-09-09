import React from 'react';
import { Box, Text, ThemeContext } from 'grommet';

import { IProfileData } from '@akashaorg/typings/ui';

import Avatar from '../Avatar';
import Button from '../Button';

export interface ICollaboratorProps {
  value: IProfileData;
  isRed?: boolean;
  buttonLabel: string;
  onClick: () => void;
}

const Collaborator: React.FC<ICollaboratorProps> = props => {
  const { value, isRed = false, buttonLabel, onClick } = props;

  const theme: any = React.useContext(ThemeContext);

  return (
    <Box direction="row" fill="horizontal" justify="between" align="center">
      <Box direction="row" gap="xsmall" align="center">
        <Avatar size="md" src={value.avatar} />
        <Box>
          <Text size="large">{value.name}</Text>
          <Text size="small" color="secondaryText">
            {value.userName}
          </Text>
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
