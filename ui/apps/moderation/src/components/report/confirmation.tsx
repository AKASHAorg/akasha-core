import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ReportItemConfirmationProps = {
  assetName?: string;
  publicImgPath?: string;
  assetExtension?: string;
  titleLabel: string;
  subtitleLabel: string;
  footnoteLabel: string;
  ctaLabel: string;
  ctaUrl: string;
  onIconClick: () => void;
};

export const ReportItemConfirmation: React.FC<ReportItemConfirmationProps> = props => {
  const {
    assetName = 'vibe-report',
    publicImgPath = '/images',
    assetExtension = 'webp',
    titleLabel,
    subtitleLabel,
    footnoteLabel,
    ctaLabel,
    onIconClick,
    ctaUrl,
  } = props;

  return (
    <Card padding={16}>
      <Stack spacing="gap-y-4" align="center">
        <Button plain={true} customStyle="self-end" onClick={onIconClick}>
          <Icon type="XMarkIcon" />
        </Button>

        <Text variant="h5" align="center">
          {titleLabel} 🙌🏽
        </Text>

        <Stack customStyle="w-40 h-40 my-2 mx-auto">
          <Image
            src={`${publicImgPath}/${assetName}.${assetExtension}`}
            dataTestId={`${assetName}-image`}
          />
        </Stack>

        <Text align="center" color={{ light: 'grey5', dark: 'grey6' }}>
          {subtitleLabel}
        </Text>

        <Stack align="center" justifySelf="end" spacing="gap-y-2">
          <Text variant="footnotes2" align="center">
            {footnoteLabel}.
          </Text>

          <a href={ctaUrl} target="_blank" rel="noreferrer noopener">
            <Button plain={true}>
              <Stack direction="row" align="center" spacing="gap-x-2">
                <Icon size="sm" accentColor={true} type="discord" customStyle="mx-auto my-0" />

                <Text
                  variant="footnotes2"
                  align="center"
                  color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                >
                  {ctaLabel}
                </Text>
              </Stack>
            </Button>
          </a>
        </Stack>
      </Stack>
    </Card>
  );
};
