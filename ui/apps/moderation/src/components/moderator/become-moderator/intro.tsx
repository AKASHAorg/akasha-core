import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  PageButtonsProps,
  PageButtons,
} from '@akashaorg/design-system-components/lib/components/PageButtons';

import { SubtitleRendererProps, SubtitleRenderer } from '../../common';

export type BMIntroProps = PageButtonsProps &
  SubtitleRendererProps & {
    assetName?: string;
    publicImgPath?: string;
    assetExtension?: string;
    titleLabel: string;
  };

const BMIntro: React.FC<BMIntroProps> = props => {
  const {
    assetName = 'moderation',
    assetExtension = 'webp',
    publicImgPath = '/images',
    titleLabel,
  } = props;

  return (
    <Card padding={16}>
      <Stack spacing="gap-y-4">
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>

        <Stack customStyle="w-40 h-40 my-2 mx-auto">
          <Image
            src={`${publicImgPath}/${assetName}.${assetExtension}`}
            dataTestId={`${assetName}-image`}
          />
        </Stack>

        <SubtitleRenderer {...props} />

        <Stack align="center" justify="end" spacing="gap-x-6">
          <PageButtons {...props} />
        </Stack>
      </Stack>
    </Card>
  );
};

export default BMIntro;
