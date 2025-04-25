import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Image } from '@akashaorg/ui/lib/akasha-components/image';
import { cn } from '@akashaorg/ui/lib/library/utils';
import { cssVars } from '@akashaorg/ui/lib/library/to-css-var';
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
  return (
    <Card
      className="p-4"
      // customStyle="dark:bg-transparent"
    >
      {assetName ? (
        <Image
          src={`${publicImagePath}/${assetName}.${assetExtension}`}
          className="w-[180px] h-[180px] m-auto my-4"
        />
      ) : (
        <Card
          style={cssVars({
            '--width': customCardSize?.width ? `${customCardSize.width}` : '180px',
            '--height': customCardSize?.height ? `${customCardSize.height}` : '180px',
          })}
          className={cn('bg-muted shrink-0 m-auto my-4', 'w-[var(--width)] h-[var(--height)]')}
        />
      )}
      <Text variant="h6" align="center">
        {infoText}
      </Text>
      <Stack justifyContent="end" spacing={4} className="w-full pt-2">
        {buttonLabel && (
          <Button variant="primary" label={buttonLabel} onClick={buttonClickHandler} />
        )}
      </Stack>
    </Card>
  );
};

export default DefaultEmptyCard;
