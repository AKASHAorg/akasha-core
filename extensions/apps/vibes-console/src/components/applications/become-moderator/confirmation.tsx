import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  PageButtonsProps,
  PageButtons,
} from '@akashaorg/design-system-components/lib/components/PageButtons';

export type BMConfirmationProps = PageButtonsProps & {
  assetName?: string;
  publicImgPath?: string;
  assetExtension?: string;
  titleLabel: string;
  descriptionLabels: string[];
};

export const BMConfirmation: React.FC<BMConfirmationProps> = props => {
  const {
    assetName = 'vibe-received',
    assetExtension = 'webp',
    publicImgPath = '/images',
    titleLabel,
    descriptionLabels,
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

        <Stack spacing="gap-y-0.5" customStyle="mb-32">
          {descriptionLabels.map((d, idx) => (
            <Text key={d} align="center" variant="body1">
              {d}
              {idx === 0 ? '.' : '!'}
            </Text>
          ))}
        </Stack>

        <PageButtons {...props} />
      </Stack>
    </Card>
  );
};
