import * as React from 'react';

export const TextLineLoadingIndicator = ({ width }: { width?: string }) => {
  return (
    <div
      className={`bg-gradient-to-r from-grey6 via-grey8 to-white dark:from-grey5 dark:via-grey7 dark:to-white animate-pulse ${width ?? 'w-full'} h-4 rounded`}
    ></div>
  );
};
