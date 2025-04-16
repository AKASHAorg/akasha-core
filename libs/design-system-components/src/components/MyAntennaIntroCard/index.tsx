import React from 'react';

import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { cn } from '@akashaorg/ui/lib/library/utils';

export type MyAntennaIntroCardProps = {
  heading: string;
  description: string;
  secondaryDescription: string;
  publicImgPath?: string;
  assetName: string;
  assetExtension?: string;
  isMinified: boolean;
  onClickCTA: () => void;
  ctaLabel: string;
};

/**
 * Intro card for 'My Antenna' page. Also serves as the header when minified.
 * @param isMinified - boolean to display the secondary presentation area
 * @param noBorderRadius - customise style to edges borders
 * @param onClickCTA - handler for the call to action button
 */
const MyAntennaIntroCard: React.FC<MyAntennaIntroCardProps> = ({
  heading,
  description,
  secondaryDescription,
  publicImgPath = '/images',
  assetExtension = 'webp',
  assetName,
  isMinified,
  onClickCTA,
  ctaLabel,
}: MyAntennaIntroCardProps) => {
  return (
    <Card className="p-0">
      <Stack
        spacing={3}
        className={cn('p-4 w-full rounded-2xl', isMinified && 'bg(grey9 dark:grey3)')}
      >
        {!isMinified && (
          <>
            {assetName && (
              <img
                loading="lazy"
                alt={assetName}
                className={'max-w-[1/2] mx-auto pr-2'}
                src={`${publicImgPath}/${assetName}.${assetExtension}`}
              />
            )}
            <Text variant="h6" align="center">
              {heading}
            </Text>
            <Text variant="body1" align="center" customStyle="px-8">
              {description}
            </Text>
          </>
        )}

        <Stack
          direction="row"
          spacing={3}
          alignItems="center"
          justifyContent={isMinified ? 'between' : 'end'}
        >
          {isMinified && <Text variant="subtitle2">{secondaryDescription}</Text>}

          <Button
            variant={isMinified ? 'outline' : 'default'}
            size="sm"
            className="w-(1/2 md:auto)"
            onClick={onClickCTA}
          >
            {ctaLabel}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default MyAntennaIntroCard;
