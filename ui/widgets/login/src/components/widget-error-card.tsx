import DS from '@akashaproject/design-system';
import * as React from 'react';

const { Box } = DS;

export interface IErrorCardProps {
  errors: {
    [key:string]: {
      error: Error;
      critical: boolean;
    };
  };
}

const WidgetErrorCard: React.FC<IErrorCardProps> = ({ errors, children }) => {
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
        <div style={{ maxWidth: '50%', padding: '0.75em' }}>
          <h3 style={{ textAlign: 'center' }}>Errors .. :((</h3>
          {errorArr.map((err, idx) => (
            <Box key={idx}>
              <code style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{err.message}</code>
              <code style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
                {err.stackTrace}
              </code>
            </Box>
          ))}
        </div>
        {!hasCriticalErrors && children}
      </Box>
    );
  }
  return <>{children}</>;
}

export default WidgetErrorCard;