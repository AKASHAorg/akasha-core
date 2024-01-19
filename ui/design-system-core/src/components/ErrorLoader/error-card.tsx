import React, { PropsWithChildren } from 'react';
import { tw } from '@twind/core';

import { ErrorLoaderProps } from '.';
import Text from '../Text';
import Card from '../Card';
import Stack from '../Stack';

interface ErrorRendererProps {
  customStyle?: string; // use valid twind classes;
}

const ErrorRenderer: React.FC<PropsWithChildren<ErrorRendererProps>> = props => {
  const { children, customStyle = '' } = props;

  return (
    <details className={tw(`w-full ${customStyle}`)}>
      <summary className={tw('whitespace-nowrap')}>Expand to see error details</summary>
      <div
        className={tw(
          'w-full bg-white right-0 border-1 border-errorLight dark:border-errorDark text-[0.8em]',
        )}
      >
        {children}
      </div>
    </details>
  );
};

const ErrorCard: React.FC<PropsWithChildren<ErrorLoaderProps & { imageSrc: string }>> = props => {
  const { children, title, imageSrc, details, devDetails, customStyle = '' } = props;

  const isDevMode = false;
  const message = details ?? devDetails;

  return (
    <Card elevation="1" customStyle={`items-center mb-0 ${customStyle}`}>
      <Stack>
        <img alt={''} className={tw('max-w-[50%] h-auto my-0 mx-auto py-8 px-0')} src={imageSrc} />
      </Stack>
      <Text variant="h5" align="center" customStyle="px-4">
        {title}
      </Text>
      {isDevMode && devDetails ? (
        <ErrorRenderer customStyle={customStyle}>
          <Text
            variant="body2"
            align="center"
            color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
            customStyle="px-4 pt-4 w-full"
          >
            {message}
          </Text>
        </ErrorRenderer>
      ) : (
        <Text
          variant="body2"
          color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
          customStyle="text-center pt-4 px-4 w-full"
          align="center"
        >
          {message}
        </Text>
      )}
      <Stack customStyle={'pt-6 pb-4'}>{children}</Stack>
    </Card>
  );
};

export default ErrorCard;
