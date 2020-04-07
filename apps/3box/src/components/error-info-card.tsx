import * as React from 'react';
import DS from '@akashaproject/design-system';

const { Box } = DS;

const ErrorInfoCard = ({
  errors,
  children,
}: {
  errors: { [key: string]: { error: Error; critical: boolean } };
  children: React.ReactChild;
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
  if (hasCriticalErrors) {
    return (
      <>
        <div>Some critical errors occured!</div>
        {errorArr.map((err, idx) => (
          <Box key={idx}>
            <code>{err.message}</code>
            <code>{err.stackTrace}</code>
          </Box>
        ))}
      </>
    );
  }

  return (
    <>
      {errorArr.map((err, idx) => (
        <Box key={idx}>
          <code>{err.message}</code>
          <code>{err.stackTrace}</code>
        </Box>
      ))}
      {children}
    </>
  );
};

export default ErrorInfoCard;
