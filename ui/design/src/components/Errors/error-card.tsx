import { Box, Text } from 'grommet';
import * as React from 'react';
import type { ErrorLoaderProps } from './interfaces';
import { StyledErrorCard, StyledImage } from './styled-elements';

const FeedCustomizationError: React.FC<ErrorLoaderProps & { imageSrc: string }> = props => {
  return (
    <StyledErrorCard>
      <Box>
        <StyledImage src={props.imageSrc} />
      </Box>
      <Box>
        <Text size="xlarge" weight="bold">
          {props.title}
        </Text>
      </Box>
      <Box align="center">
        <Text
          size="large"
          color="secondaryText"
          textAlign="center"
          style={{ paddingTop: '1em', maxWidth: '70%' }}
        >
          {props.details}
        </Text>
      </Box>
      <Box pad={{ top: '1.5em', bottom: '1em' }}>{props.children}</Box>
    </StyledErrorCard>
  );
};

export default FeedCustomizationError;
