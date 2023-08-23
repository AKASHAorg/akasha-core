import React, { PropsWithChildren } from 'react';
import { tw } from '@twind/core';

import { ErrorLoaderProps } from '.';
import Text from '../Text';
import Card from '../Card';
import Box from '../Box';

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
    <Card elevation="1" customStyle={tw(`items-center ${customStyle}`)}>
      <Box>
        <img alt={''} className={tw('max-w-[50%] h-auto my-0 mx-auto py-8 px-0')} src={imageSrc} />
      </Box>
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
          color={{ light: 'secondaryLight', dark: 'secondaryLight' }}
          customStyle="text-center pt-4 px-4 w-full"
          align="center"
        >
          {message}
        </Text>
      )}
      <Box customStyle={tw('pt-6 pb-4')}>{children}</Box>
    </Card>
  );
};

export default ErrorCard;
