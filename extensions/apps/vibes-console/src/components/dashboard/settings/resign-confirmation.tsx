import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
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
    <Card className="p-4">
      <Stack alignItems="center" spacing={6}>
        <Typography variant="h5" className="text-center">
          {titleLabel}
        </Typography>
        <Stack className="w-40 h-40 my-2 mx-auto">
          <Image
            src={`${publicImgPath}/${assetName}.${assetExtension}`}
            dataTestId={`${assetName}-image`}
          />
        </Stack>
        <Typography variant="sm" className="font-light text-center font-light w-full md:w-[55%]">
          {subtitleLabel}!
        </Typography>
        <button onClick={onContinueClick}>
          <Typography variant="sm" bold className="text-secondaryLight dark:text-secondaryDark">
            {continueLabel}
          </Typography>
        </button>
      </Stack>
    </Card>
  );
};
