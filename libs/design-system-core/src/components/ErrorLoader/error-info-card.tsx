import React from 'react';
import { tw } from '@twind/core';

export interface IErrorInfoCardProps {
  error?: Error;
  children: (message: React.ReactElement | null) => React.ReactElement;
}

export const ErrorInfoCard = (props: IErrorInfoCardProps) => {
  const { error, children } = props;

  const className = 'text-start text-errorLight dark:text-errorDark text-[0.65em] overflow-x-auto';

  if (error) {
    const message = (
      <div>
        <pre className={tw(className)}>{error.message}</pre>
        <pre className={tw(className)}>{error.stack}</pre>
      </div>
    );
    return children(<>{message}</>);
  }
  return children(null);
};
