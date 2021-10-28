import * as React from 'react';
import { Box } from 'grommet';
import styled from 'styled-components';

const ErrorElement = styled('pre')`
  text-align: start;
  color: ${props => props.theme.colors.red};
  font-size: 0.65em;
  overflow-x: auto;
`;

export const ErrorInfoCard = ({
  error,
  children,
}: {
  error?: Error;
  children: (message: React.ReactElement | null) => React.ReactElement;
}) => {
  if (error) {
    const message = (
      <Box>
        <ErrorElement>{error.message}</ErrorElement>
        <ErrorElement>{error.stack}</ErrorElement>
      </Box>
    );
    return children(<>{message}</>);
  }
  return children(null);
};
