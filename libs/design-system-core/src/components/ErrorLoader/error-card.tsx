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
  const { children, imageSrc, title, details, dataTestId, customStyle = '' } = props;

  return (
    <Card padding="p-8" customStyle={customStyle} dataTestId={dataTestId}>
      <Stack spacing="gap-y-4" align="center">
        <Image
          src={imageSrc}
          loading="lazy"
          decoding="async"
          alt="error-card"
          className={tw('w-48 h-48')}
        />

        <Stack spacing="gap-y-1" align="center">
          <Text variant="h5" align="center" selectable={false}>
            {title}
          </Text>
          <Text variant="body2" customStyle="text-grey4 dark:text-grey6 my-4" selectable={false}>
            {details}
          </Text>
        </Stack>
        {children}
      </Stack>
    </Card>
  );
};

export default ErrorCard;
