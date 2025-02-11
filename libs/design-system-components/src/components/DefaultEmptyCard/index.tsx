import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { cn } from '@akashaorg/ui/lib/library/utils';

type CardSize = { width?: string | number; height?: string | number };

export type DefaultEmptyCardProps = {
  publicImagePath?: string;
  assetExtension?: string;
  infoText: string;
  buttonLabel?: string;
  assetName?: string;
  noBorder?: boolean;
  customCardSize?: CardSize;
  buttonClickHandler?: () => void;
};

/**
 * Card component used to display generic info and images
 * @param assetName - name of the image from the public folder,
 * if not provided will render a placeholder card instead
 * @param infoText - descriptive text
 * @param buttonLabel - button text
 * @param noBorder - defaults to false, can be set true to remove the card outer border
 * @param customCardSize - object with width and height to customise the card dimensions
 * @param buttonClickHandler - handler for the button
 */
const DefaultEmptyCard: React.FC<DefaultEmptyCardProps> = ({
  publicImagePath = '/images',
  assetExtension = 'webp',
  infoText,
  buttonLabel,
  assetName,
  customCardSize,
  buttonClickHandler,
}) => {
  const cardSize = ` w-[${customCardSize?.width ? customCardSize.width : '180px'}] h-[${
    customCardSize?.height ? customCardSize.height : '180px'
  }]`;

  return (
    <Card
      className="p-4"
      // customStyle="dark:bg-transparent"
    >
      {assetName ? (
        <Image
          src={`${publicImagePath}/${assetName}.${assetExtension}`}
          customStyle="w-[180px] h-[180px] m-auto my-4"
        />
      ) : (
        <Card className={cn('bg-muted shrink-0 m-auto my-4', cardSize)} />
      )}
      <Text variant="h6" align="center">
        {infoText}
      </Text>
      <Stack justify="end" fullWidth spacing="gap-y-4" customStyle="pt-2">
        {buttonLabel && (
          <Button variant="primary" label={buttonLabel} onClick={buttonClickHandler} />
        )}
      </Stack>
    </Card>
  );
};

export default DefaultEmptyCard;
