import React from 'react';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IStepOneProps {
  assetName?: string;
  titleLabel: string;
  publicImgPath?: string;
  textLine1Label: string;
  textLine2Label: string;
  textLine3Label: string;
  skipLabel: string;
  nextLabel: string;
  onClickIcon: () => void;
  onClickSkip: () => void;
  onClickNext: () => void;
}

const StepOne: React.FC<IStepOneProps> = props => {
  const {
    assetName = 'blocks',
    titleLabel,
    publicImgPath = '/images',
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
    <BasicCardBox customStyle="mb-4">
      <Box customStyle="flex items-start w-full p-4">
        <Box customStyle="flex flex-row w-full mb-4">
          <button onClick={onClickIcon}>
            <Icon type="ChevronLeftIcon" />{' '}
          </button>
          <Text variant="h2">{titleLabel}</Text>
        </Box>
        <Box customStyle="flex w-full gap-1">
          <Text variant="h6">{textLine1Label}</Text>
          <Text variant="h6">{textLine2Label}</Text>
          <Box customStyle="w-48">
            <Image customStyle="object-contain" src={`${publicImgPath}/${assetName}.webp`} />
          </Box>
          <Text variant="h6">{textLine3Label}</Text>
        </Box>
        <Box customStyle="flex flex-row w-full justify-end items-center gap-2">
          <Button size="lg" label={skipLabel} onClick={onClickSkip} />
          <Button size="lg" variant="primary" label={nextLabel} onClick={onClickNext} />
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default StepOne;
