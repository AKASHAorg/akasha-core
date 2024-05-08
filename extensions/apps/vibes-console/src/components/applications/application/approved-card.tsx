import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

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
    <Card>
      <Stack spacing="gap-y-4">
        <Text variant="h5" align="center">
          🎉 {titleLabel}! 🎉
        </Text>

        <Stack customStyle="w-[11.25rem] h-[11.25rem] mx-auto">
          <Image
            src={`${publicImgPath}/${assetName}.${assetExtension}`}
            dataTestId={`${assetName}-image`}
          />
        </Stack>

        <Text align="center" variant="footnotes2">
          {descriptionLabel}! ✨
        </Text>

        <Button
          variant="text"
          size="md"
          label={buttonLabel}
          customStyle="w-fit self-center"
          onClick={onButtonClick}
        />
      </Stack>
    </Card>
  );
};
