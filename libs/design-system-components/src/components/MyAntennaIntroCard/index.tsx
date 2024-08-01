import React from 'react';
import { tw } from '@twind/core';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

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
    <Card padding={0}>
      <Stack
        padding="p-4"
        spacing="gap-y-3"
        fullWidth={true}
        customStyle="rounded-2xl"
        {...(isMinified && { background: { light: 'grey9', dark: 'grey3' } })}
      >
        {!isMinified && (
          <>
            {assetName && (
              <img
                loading="lazy"
                alt={assetName}
                className={tw('max-w-[1/2] mx-auto pr-2')}
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

        <Stack direction="row" align="center" justify={isMinified ? 'between' : 'end'}>
          {isMinified && <Text variant="body1">{secondaryDescription}</Text>}

          <Button
            variant={isMinified ? 'secondary' : 'primary'}
            label={ctaLabel}
            customStyle="ml-8 w-(1/2 md:auto)"
            onClick={onClickCTA}
          />
        </Stack>
      </Stack>
    </Card>
  );
};

export default MyAntennaIntroCard;
