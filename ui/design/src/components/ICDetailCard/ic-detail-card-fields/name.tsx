import * as React from 'react';
import { Text } from 'grommet';
import { StyledInlineBox } from '../../ProfileCard/styled-profile-card';

export interface ICDetailCardNameProps {
  name?: string;
}

const ICDetailCardName: React.FC<ICDetailCardNameProps> = props => {
  return (
    <>
      <StyledInlineBox direction="row" gap="xsmall" align="center">
        <Text size="xlarge" weight="bold" color="primaryText" truncate={true}>
          {props.name}
        </Text>
      </StyledInlineBox>
    </>
  );
};

export default ICDetailCardName;
