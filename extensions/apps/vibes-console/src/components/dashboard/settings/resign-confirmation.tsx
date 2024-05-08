import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ResignConfirmationProps = {
  assetName?: string;
  publicImgPath?: string;
  assetExtension?: string;
  titleLabel: string;
  subtitleLabel: string;
  continueLabel: string;
  onContinueClick: () => void;
};

export const ResignConfirmation: React.FC<ResignConfirmationProps> = props => {
  const {
    assetName = 'vibe-byemoderator',
    publicImgPath = '/images',
    assetExtension = 'webp',
    titleLabel,
    subtitleLabel,
    continueLabel,
    onContinueClick,
  } = props;

  return (
    <Card padding={20}>
      <Stack align="center" spacing="gap-y-6">
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>
        <Stack customStyle="w-40 h-40 my-2 mx-auto">
          <Image
            src={`${publicImgPath}/${assetName}.${assetExtension}`}
            dataTestId={`${assetName}-image`}
          />
        </Stack>
        <Text variant="subtitle2" align="center" weight="light" customStyle="w-(full md:[55%])">
          {subtitleLabel}!
        </Text>
        <Button plain={true} onClick={onContinueClick}>
          <Text variant="button-md" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
            {continueLabel}
          </Text>
        </Button>
      </Stack>
    </Card>
  );
};
