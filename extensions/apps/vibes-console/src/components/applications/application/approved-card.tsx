import React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type ApplicationApprovedCardProps = {
  assetName?: string;
  publicImgPath?: string;
  assetExtension?: string;
  titleLabel: string;
  descriptionLabel: string;
  buttonLabel: string;
  onButtonClick: () => void;
};
export const ApplicationApprovedCard: React.FC<ApplicationApprovedCardProps> = props => {
  const {
    assetName = 'vibe-approved',
    assetExtension = 'webp',
    publicImgPath = '/images',
    titleLabel,
    descriptionLabel,
    buttonLabel,
    onButtonClick,
  } = props;
  return (
    <Card className="shadow-none">
      <Stack spacing="gap-y-4">
        <Typography variant="h5" className="text-center">
          🎉 {titleLabel}! 🎉
        </Typography>

        <Stack customStyle="w-[11.25rem] h-[11.25rem] mx-auto">
          <Image
            src={`${publicImgPath}/${assetName}.${assetExtension}`}
            dataTestId={`${assetName}-image`}
          />
        </Stack>

        <Typography variant="xs" className="text-center font-medium">
          {descriptionLabel}! ✨
        </Typography>

        <Button variant="link" onClick={onButtonClick} className="w-fit self-center">
          {buttonLabel}
        </Button>
      </Stack>
    </Card>
  );
};
