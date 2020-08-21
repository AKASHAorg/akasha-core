import * as React from 'react';
import { Box } from 'grommet';

const ErrorInfoCard = ({
  errors = {},
  children,
}: {
  errors?: { [key: string]: { error: Error; critical: boolean } };
  children: (
    messages: React.ReactElement | null,
    isCritical: boolean,
    errors?: {},
  ) => React.ReactElement;
}) => {
  const errorArr = Object.keys(errors).map(errorKey => {
    const errorObj = errors[errorKey];
    return {
      message: errorObj.error.message,
      stackTrace: errorObj.error.stack,
      isCritical: errorObj.critical,
    };
  });
  const hasCriticalErrors = errorArr.some(err => err.isCritical);
  if (errorArr.length) {
    const messages = errorArr.map((err, idx) => (
      <Box key={idx}>
        <code style={{ whiteSpace: 'pre', wordBreak: 'keep-all' }}>{err.message}</code>
        <code style={{ whiteSpace: 'pre', wordBreak: 'keep-all' }}>{err.stackTrace}</code>
      </Box>
    ));
    return children(<>{messages}</>, hasCriticalErrors, errorArr);
  }
  return children(null, false);
};

export default ErrorInfoCard;
