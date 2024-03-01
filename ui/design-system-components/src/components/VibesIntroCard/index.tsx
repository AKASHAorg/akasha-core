import React from 'react';
import { tw } from '@twind/core';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';

export type OverviewCTA = {
  label: string;
  url: string;
  handler?: () => void;
};

export type VibesIntroCardProps = {
  assetName?: string;
  assetExtension?: string;
  titleLabel: string;
  introLabel: string;
  subtitleLabel: string;
  publicImgPath?: string;
  overviewCTAArr: OverviewCTA[];
};

const VibesIntroCard: React.FC<VibesIntroCardProps> = props => {
  const {
    assetName = 'vibe-overview',
    titleLabel,
    introLabel,
    subtitleLabel,
    assetExtension = 'webp',
    publicImgPath = '/images',
    overviewCTAArr,
  } = props;

  return (
    <Card padding={16}>
      <Stack spacing="gap-4" customStyle="grid grid-cols-1">
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>

        <Stack customStyle="w-40 h-40 my-2 mx-auto">
          <img
            className={tw('object-contain')}
            aria-label={assetName}
            src={`${publicImgPath}/${assetName}.${assetExtension}`}
            alt={assetName}
            data-testid={`${assetName}-image`}
          />
        </Stack>

        {introLabel && (
          <Text weight="bold" align="center">
            {introLabel}
          </Text>
        )}

        {subtitleLabel && (
          <Text variant="subtitle2" align="center">
            {subtitleLabel}
          </Text>
        )}

        {overviewCTAArr && overviewCTAArr.length > 0 && (
          <Stack justify="between" customStyle="md:px-20" spacing="gap-y-4">
            {overviewCTAArr.map(({ url, label, handler }, idx) => (
              <Stack key={label + idx}>
                {handler && typeof handler === 'function' ? (
                  <Button plain={true} onClick={handler}>
                    <Text
                      weight="bold"
                      align="center"
                      variant="button-md"
                      color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                    >
                      {label}
                    </Text>
                  </Button>
                ) : (
                  <Anchor
                    href={url}
                    dataTestId={`${label}-link`}
                    customStyle="text-sm text-center font-bold"
                  >
                    {label}
                  </Anchor>
                )}
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default VibesIntroCard;
