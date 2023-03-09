import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

import { ErrorLoaderProps } from '.';
import Text from '../Text';

interface ErrorRendererProps {
  className?: string; // use valid twind classes;
}

const ErrorRenderer: React.FC<PropsWithChildren<ErrorRendererProps>> = props => {
  const { children, className = '' } = props;

  return (
    <details className={tw(apply`w-full ${className}`)}>
      <summary className={tw('whitespace-nowrap')}>Expand to see error details</summary>
      <div
        className={tw(
          apply(
            'w-full bg-white right-0 border-1 border-error-light dark:border-error-dark text-[0.8em]',
          ),
        )}
      >
        {children}
      </div>
    </details>
  );
};

const ErrorCard: React.FC<PropsWithChildren<ErrorLoaderProps & { imageSrc: string }>> = props => {
  const { children, title, imageSrc, details, devDetails, className } = props;

  const isDevMode = false;
  const message = details ?? devDetails;

  return (
    <div className={tw(apply`flex flex-col items-center p-[1em] bg-white ${className}`)}>
      <div>
        <img
          className={tw(apply('max-w-[50%] h-auto my-0 mx-auto py-[2em] px-0'))}
          src={imageSrc}
        />
      </div>

      <Text variant="h5" color={{ light: 'text-black', dark: 'dark:text-black' }}>
        {title}
      </Text>

      {isDevMode && devDetails ? (
        <ErrorRenderer className={tw(apply(className))}>
          <Text
            variant="label"
            color={{ light: 'text-secondary-light', dark: 'dark:text-secondary-light' }}
            className={tw(apply('pt-[1em] max-w-[70%] w-full'))}
          >
            {message}
          </Text>
        </ErrorRenderer>
      ) : (
        <Text
          variant="label"
          color={{ light: 'text-secondary-light', dark: 'dark:text-secondary-light' }}
          className={tw(apply('text-center pt-[1em] max-w-[70%] w-full'))}
        >
          {message}
        </Text>
      )}
      <div className={tw(apply('pt-[1.5em] pb-[1em]'))}>{children}</div>
    </div>
  );
};

export default ErrorCard;
