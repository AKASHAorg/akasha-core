import React from 'react';
import { tw } from '@twind/core';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export type VibesValueCardProps = {
  publicImgPath?: string;
  assetExtension?: string;
  assetName: string;
  label: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  isMini?: boolean;
  onClick?: () => void;
};

const VibesValueCard: React.FC<VibesValueCardProps> = props => {
  const {
    publicImgPath = '/images',
    assetExtension = 'webp',
    assetName,
    label,
    description,
    ctaLabel,
    ctaUrl,
    isMini = false,
    onClick,
  } = props;

  return (
    <Button plain={true} onClick={onClick}>
      <Card
        padding="p-0"
        customStyle={`rounded-2xl cursor-pointer ${isMini ? 'bg(grey9 dark:grey3) h-32' : ''}`}
      >
        <Stack align="center" justify="evenly" spacing="gap-y-4" padding={isMini ? 'p-3' : 'p-4'}>
          <Stack customStyle={`w-${isMini ? '16' : '72'} h-${isMini ? '16' : '72'}`}>
            <img
              alt={assetName}
              className={tw('object-contain')}
              src={`${publicImgPath}/${assetName}.${assetExtension}`}
            />
          </Stack>

          <Text
            variant={isMini ? 'footnotes1' : 'h5'}
            align="center"
            color={{
              light: isMini ? 'secondaryLight' : 'black',
              dark: isMini ? 'secondaryDark' : 'white',
            }}
            weight="bold"
          >
            {label}
          </Text>

          {!isMini && (
            <>
              {description && (
                <Text variant="body2" align="center">
                  {description}
                </Text>
              )}

              {ctaLabel && (
                <a
                  href={ctaUrl}
                  className={tw(
                    'text-sm self-end font-bold no-underline text(secondaryLight dark:secondaryDark)',
                  )}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {ctaLabel}
                </a>
              )}
            </>
          )}
        </Stack>
      </Card>
    </Button>
  );
};

export default VibesValueCard;
