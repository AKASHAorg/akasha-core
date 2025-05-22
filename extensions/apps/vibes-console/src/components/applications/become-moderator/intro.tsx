import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import {
  PageButtonsProps,
  PageButtons,
} from '@akashaorg/design-system-components/lib/components/PageButtons';
import {
  SubtitleRendererProps,
  SubtitleRenderer,
} from '@akashaorg/design-system-components/lib/components/SubtitleRenderer';
export type BMIntroProps = PageButtonsProps &
  SubtitleRendererProps & {
    assetName?: string;
    publicImgPath?: string;
    assetExtension?: string;
    titleLabel: string;
  };
export const BMIntro: React.FC<BMIntroProps> = props => {
  const {
    assetName = 'vibe-overview',
    assetExtension = 'webp',
    publicImgPath = '/images',
    titleLabel,
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

        <SubtitleRenderer {...props} />

        <PageButtons {...props} />
      </Stack>
    </Card>
  );
};
