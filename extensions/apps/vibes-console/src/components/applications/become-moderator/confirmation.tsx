import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
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

        <Stack spacing={0} className="mb-32">
          {descriptionLabels.map((d, idx) => (
            <Typography key={d} className="text-center">
              {d}
              {idx === 0 ? '.' : '!'}
            </Typography>
          ))}
        </Stack>

        <PageButtons {...props} />
      </Stack>
    </Card>
  );
};
