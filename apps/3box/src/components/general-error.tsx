import * as React from 'react';

interface IErrorProps {
  error: Error;
  critical: boolean;
}

export const GeneralError: React.FC<IErrorProps> = props => {
  const { error, critical } = props;
  if (critical) {
    return <>{error.message}</>;
  }
  return (
    <>
      {error.message}
      <>{props.children}</>
    </>
  );
};

export default GeneralError;
