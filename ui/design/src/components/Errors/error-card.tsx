import { Box, Text } from 'grommet';
import * as React from 'react';
import type { ErrorLoaderProps } from './interfaces';
import { StyledErrorCard, StyledImage } from './styled-elements';

interface ErrorRendererProps {
  colorProp: any;
  size: any;
  textAlign: any;
  style: any;
  level: any;
  theme: any;
  className: any;
}

const ErrorRenderer: React.FC<ErrorRendererProps> = props => {
  return (
    <details style={{ width: '100%' }}>
      <summary>Expand to see error details</summary>
      <div
        style={{
          width: '100%',
          background: '#FFF',
          right: 0,
          border: '1px solid red',
          fontSize: '.8em',
        }}
      >
        {props.children}
      </div>
    </details>
  );
};

const ErrorCard: React.FC<ErrorLoaderProps & { imageSrc: string }> = props => {
  const { details, devDetails } = props;
  let message;
  let isDevMode = false;
  if (process.env.NODE_ENV !== 'production') {
    isDevMode = true;
    message = devDetails || details;
  }

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
          as={isDevMode && props.devDetails ? ErrorRenderer : 'span'}
        >
          {message}
        </Text>
      </Box>
      <Box pad={{ top: '1.5em', bottom: '1em' }}>{props.children}</Box>
    </StyledErrorCard>
  );
};

export default ErrorCard;
