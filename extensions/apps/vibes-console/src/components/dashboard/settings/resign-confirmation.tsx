import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
      <Stack align="center" spacing="gap-y-6">
        <Typography variant="h5" className="text-center">
          {titleLabel}
        </Typography>
        <Stack customStyle="w-40 h-40 my-2 mx-auto">
          <Image
            src={`${publicImgPath}/${assetName}.${assetExtension}`}
            dataTestId={`${assetName}-image`}
          />
        </Stack>
        <Typography variant="sm" className="font-light text-center font-light w-full md:w-[55%]">
          {subtitleLabel}!
        </Typography>
        <Button plain={true} onClick={onContinueClick}>
          <Typography variant="sm" bold className="text-secondaryLight dark:text-secondaryDark">
            {continueLabel}
          </Typography>
        </Button>
      </Stack>
    </Card>
  );
};
