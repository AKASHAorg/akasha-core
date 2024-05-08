import React from 'react';

import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Discord } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ReportItemConfirmationProps = {
  assetName?: string;
  publicImgPath?: string;
  assetExtension?: string;
  titleLabel: string;
  subtitleLabel: string;
  footnoteLabel: string;
  continueLabel: string;
  ctaLabel: string;
  ctaUrl: string;
  onContinueClick: () => void;
};

export const ReportItemConfirmation: React.FC<ReportItemConfirmationProps> = props => {
  const {
    assetName = 'vibe-report',
    publicImgPath = '/images',
    assetExtension = 'webp',
    titleLabel,
    subtitleLabel,
    footnoteLabel,
    continueLabel,
    ctaLabel,
    onContinueClick,
    ctaUrl,
  } = props;

  return (
    <Card customStyle="p(6 md:4)">
      <Stack spacing="gap-y-4" align="center">
        <Text variant="h5" align="center">
          {titleLabel} 🙌🏽
        </Text>

        <Stack customStyle="w-45 h-45 my-2 mx-auto">
          <Image
            src={`${publicImgPath}/${assetName}.${assetExtension}`}
            dataTestId={`${assetName}-image`}
          />
        </Stack>

        <Text
          variant="body2"
          weight="normal"
          align="center"
          color={{ light: 'grey5', dark: 'grey6' }}
        >
          {subtitleLabel}
        </Text>

        <Button variant="text" size="md" label={continueLabel} onClick={onContinueClick} />

        <Stack align="center" justifySelf="end" spacing="gap-y-2">
          <Text variant="footnotes2" weight="normal" align="center">
            {footnoteLabel}
          </Text>

          <Anchor href={ctaUrl} target="_blank">
            <Stack direction="row" align="center" spacing="gap-x-2">
              <Icon
                size="sm"
                accentColor={true}
                icon={<Discord />}
                solid={true}
                customStyle="mx-auto my-0"
              />

              <Text
                variant="footnotes2"
                weight="normal"
                align="center"
                color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
              >
                {ctaLabel}
              </Text>
            </Stack>
          </Anchor>
        </Stack>
      </Stack>
    </Card>
  );
};
