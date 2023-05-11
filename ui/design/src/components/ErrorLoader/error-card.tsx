import { Box, Text } from 'grommet';
import { AlignType, ColorType, EdgeSizeType } from 'grommet/utils';
import * as React from 'react';
import type { ErrorLoaderProps } from './interfaces';
import { StyledErrorCard, StyledImage } from './styled-elements';

interface ErrorRendererProps {
  colorProp: ColorType;
  size: EdgeSizeType;
  textAlign: AlignType;
  level: any;
  theme: any;
  className: string;
  style: React.CSSProperties;
  children?: React.ReactNode;
}

const ErrorRenderer: React.FC<ErrorRendererProps> = props => {
  return (
    <details style={{ width: '100%', ...props.style }}>
      <summary style={{ whiteSpace: 'nowrap' }}>Expand to see error details</summary>
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
  const isDevMode = false;
  const message = details ?? devDetails;

  return (
    <StyledErrorCard style={props.style} noBorder={props.noBorder}>
      <Box>
        <StyledImage src={props.imageSrc} />
      </Box>
      <Box align="center" fill="horizontal">
        <Text size="xlarge" weight="bold" textAlign="center">
          {props.title}
        </Text>
      </Box>
      <Box align="center" fill="horizontal">
        <Text
          size="large"
          color="secondaryText"
          textAlign="center"
          style={{ paddingTop: '1em', maxWidth: '70%', width: '100%' }}
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
