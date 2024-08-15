import React from 'react';
import { tw } from '@twind/core';
import Card from '../Card';
import Image from '../Image';
import Stack from '../Stack';
import Text from '../Text';
import { ErrorLoaderProps } from '.';

const ErrorCard: React.FC<
  React.PropsWithChildren<ErrorLoaderProps & { imageSrc: string }>
> = props => {
  const { children, imageSrc, title, details, customStyle = '' } = props;

  return (
    <Card padding="p-8" customStyle={customStyle}>
      <Stack spacing="gap-y-4" align="center">
        <Image
          src={imageSrc}
          loading="lazy"
          decoding="async"
          alt="error-card"
          className={tw('w-48 h-48')}
        />

        <Stack spacing="gap-y-1" align="center" customStyle="w(64 md:96)">
          <Text variant="h5" align="center">
            {title}
          </Text>
          <Text variant="body2" align="center">
            {details}
          </Text>
        </Stack>

        {children}
      </Stack>
    </Card>
  );
};

export default ErrorCard;
