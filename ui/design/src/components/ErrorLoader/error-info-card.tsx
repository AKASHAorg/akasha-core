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
  errors = {},
  children,
}: {
  errors?: { [key: string]: { error: Error; critical: boolean } };
  children: (
    messages: React.ReactElement | null,
    isCritical: boolean,
    errors?: Record<string, unknown>[],
  ) => React.ReactElement;
}) => {
  const errorArr =
    errors &&
    Object.keys(errors).map(errorKey => {
      const errorObj = errors[errorKey];
      return {
        message: errorObj.error.message,
        stackTrace: errorObj.error.stack,
        isCritical: errorObj.critical,
      };
    });
  const hasCriticalErrors = errorArr.some(err => err.isCritical);
  if (errorArr?.length) {
    const messages = errorArr.map((err, idx) => (
      <Box key={idx}>
        <ErrorElement>{err.message}</ErrorElement>
        <ErrorElement>{err.stackTrace}</ErrorElement>
      </Box>
    ));
    return children(<>{messages}</>, hasCriticalErrors, errorArr);
  }
  return children(null, false);
};
