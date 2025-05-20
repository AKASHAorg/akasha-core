import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
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
    <Card className="p-4">
      <Stack spacing={4}>
        <Typography variant="h5" className="text-center">
          {titleLabel}
        </Typography>

        <Stack className="w-[11.25rem] h-[11.25rem] my-2 mx-auto">
          <Image
            src={`${publicImgPath}/${assetName}.${assetExtension}`}
            dataTestId={`${assetName}-image`}
          />
        </Stack>

        <Typography className="text-center mb-32">{descriptionLabel}! ✨</Typography>

        <PageButtons {...props} />
      </Stack>
    </Card>
  );
};
