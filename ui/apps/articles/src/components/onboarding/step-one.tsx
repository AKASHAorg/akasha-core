import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ChevronLeftIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type StepOneProps = {
  assetName?: string;
  assetExtension?: string;
  publicImgPath?: string;
  titleLabel: string;
  textLine1Label: string;
  textLine2Label: string;
  textLine3Label: string;
  skipLabel: string;
  nextLabel: string;
  onClickIcon: () => void;
  onClickSkip: () => void;
  onClickNext: () => void;
};

const StepOne: React.FC<StepOneProps> = props => {
  const {
    assetName = 'blocks',
    assetExtension = 'webp',
    publicImgPath = '/images',
    titleLabel,
    textLine1Label,
    textLine2Label,
    textLine3Label,
    skipLabel,
    nextLabel,
    onClickIcon,
    onClickSkip,
    onClickNext,
  } = props;

  return (
    <Card customStyle="mb-4">
      <Stack fullWidth={true} align="start" customStyle="p-4">
        <Stack direction="row" fullWidth={true} customStyle="mb-4">
          <button onClick={onClickIcon}>
            <Icon icon={<ChevronLeftIcon />} />
          </button>{' '}
          <Text variant="h2">{titleLabel}</Text>
        </Stack>
        <Stack fullWidth={true} spacing="gap-1">
          <Text variant="h6">{textLine1Label}</Text>
          <Text variant="h6">{textLine2Label}</Text>
          <Stack customStyle="w-48">
            <Image
              customStyle="object-contain"
              src={`${publicImgPath}/${assetName}.${assetExtension}`}
            />
          </Stack>
          <Text variant="h6">{textLine3Label}</Text>
        </Stack>
        <Stack direction="row" fullWidth={true} align="center" justify="end" spacing="gap-2">
          <Button size="lg" label={skipLabel} onClick={onClickSkip} />
          <Button size="lg" variant="primary" label={nextLabel} onClick={onClickNext} />
        </Stack>
      </Stack>
    </Card>
  );
};

export default StepOne;
