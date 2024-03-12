import React from 'react';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
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
        elevation={isMini ? 'none' : '1'}
        customStyle={`rounded-2xl cursor-pointer ${isMini ? 'bg(grey9 dark:grey3)' : ''}`}
      >
        <Stack
          justify={isMini ? 'between' : 'evenly'}
          padding={isMini ? 'p-3' : 'p-4'}
          {...(isMini && { customStyle: 'h-32' })}
        >
          <Stack customStyle={`w-${isMini ? '16' : '72'} h-${isMini ? '16' : '72'} self-center`}>
            <img
              alt={assetName}
              className="object-contain"
              src={`${publicImgPath}/${assetName}.${assetExtension}`}
            />
          </Stack>

          <Text
            variant={isMini ? 'button-sm' : 'h5'}
            align={isMini ? 'center' : 'start'}
            weight="bold"
            color={{
              light: isMini ? 'secondaryLight' : 'black',
              dark: isMini ? 'secondaryDark' : 'white',
            }}
            {...(isMini && { customStyle: 'px-4' })}
          >
            {label}
          </Text>

          {!isMini && (
            <Stack spacing="gap-y-4">
              {description && (
                <Text variant="body1" weight="light">
                  {description}
                </Text>
              )}

              {ctaLabel && (
                <Anchor
                  href={ctaUrl}
                  customStyle="text-sm self-end font-bold no-underline text(secondaryLight dark:secondaryDark)"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {ctaLabel}
                </Anchor>
              )}
            </Stack>
          )}
        </Stack>
      </Card>
    </Button>
  );
};

export default VibesValueCard;
