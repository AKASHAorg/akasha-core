import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  PageButtonsProps,
  PageButtons,
} from '@akashaorg/design-system-components/lib/components/PageButtons';

export type WAConfirmationProps = PageButtonsProps & {
  assetName?: string;
  publicImgPath?: string;
  assetExtension?: string;
  titleLabel: string;
  descriptionLabel: string;
};

export const WAConfirmation: React.FC<WAConfirmationProps> = props => {
  const {
    assetName = 'vibe-byemoderator',
    assetExtension = 'webp',
    publicImgPath = '/images',
    titleLabel,
    descriptionLabel,
  } = props;

  return (
    <Card padding={16}>
      <Stack spacing="gap-y-4">
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>

        <Stack customStyle="w-[11.25rem] h-[11.25rem] my-2 mx-auto">
          <Image
            src={`${publicImgPath}/${assetName}.${assetExtension}`}
            dataTestId={`${assetName}-image`}
          />
        </Stack>

        <Text align="center" variant="body1" customStyle="mb-32">
          {descriptionLabel}! ✨
        </Text>

        <PageButtons {...props} />
      </Stack>
    </Card>
  );
};
