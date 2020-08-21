import * as React from 'react';
import DS from '@akashaproject/design-system';

const { Box, BasicCardBox } = DS;

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
  if (errorArr.length) {
    return (
      <Box align="center" justify="center" fill="horizontal">
        <BasicCardBox style={{ maxWidth: '50%', padding: '0.75em' }}>
          <h3 style={{ textAlign: 'center' }}>Errors .. :((</h3>
          {errorArr.map((err, idx) => (
            <Box key={idx}>
              <code style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{err.message}</code>
              <code style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
                {err.stackTrace}
              </code>
            </Box>
          ))}
        </BasicCardBox>
        {!hasCriticalErrors && children}
      </Box>
    );
  }
  return <>{children}</>;
};

export default ErrorInfoCard;
