import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { XMarkIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ResignConfirmationProps = {
  assetName?: string;
  publicImgPath?: string;
  assetExtension?: string;
  titleLabel: string;
  subtitleLabel: string;
  onCloseButtonClick: () => void;
};

const ResignConfirmation: React.FC<ResignConfirmationProps> = props => {
  const {
    assetName = 'vibe-byemoderator',
    publicImgPath = '/images',
    assetExtension = 'webp',
    titleLabel,
    subtitleLabel,
    onCloseButtonClick,
  } = props;

  return (
    <Card padding={20}>
      <Stack customStyle="self-end">
        <Button plain={true} onClick={onCloseButtonClick}>
          <Icon icon={<XMarkIcon />} />
        </Button>
      </Stack>
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
        <Text variant="footnotes2" align="center">
          {subtitleLabel}
        </Text>
      </Stack>
    </Card>
  );
};

export default ResignConfirmation;
