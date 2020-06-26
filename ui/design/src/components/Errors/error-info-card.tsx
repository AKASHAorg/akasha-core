import * as React from 'react';
import { Box } from 'grommet';
import { BasicCardBox } from '../Cards';

const ErrorInfoCard = ({
  title,
  errors = {},
  children,
}: {
  title: string;
  errors?: { [key: string]: { error: Error; critical: boolean } };
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
      <Box align="center" justify="center" fill={true}>
        <BasicCardBox style={{ padding: '0.75em' }}>
          <h3 style={{ textAlign: 'center' }}>{title}</h3>
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
