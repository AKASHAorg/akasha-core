import React from 'react';
import { tw } from '@twind/core';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';

type DevDashOnboardingIntroProps = {
  assetName?: string;
  titleLabel: string;
  introLabel: string;
  descriptionLabel: string;
  publicImgPath?: string;
  ctaButtonLabel: string;
  onCTAButtonClick: () => void;
};

export const ONBOARDING_STATUS = 'ewa-dev-dashboard-onboarding-status';

export const DevDashOnboardingIntro: React.FC<DevDashOnboardingIntroProps> = props => {
  const {
    assetName = 'dev-dashboard-intro',
    publicImgPath = '/images',
    titleLabel,
    introLabel,
    descriptionLabel,
    ctaButtonLabel,
    onCTAButtonClick,
  } = props;

  return (
    <BasicCardBox>
      <Box customStyle="flex flex-col items-center w-full p-2">
        <Text variant="h5" align="center" weight="bold">
          {titleLabel}
        </Text>

        <Box customStyle="w-[17.5rem] h-[17.5rem] my-6">
          <img
            alt={`${assetName}`}
            className={tw('object-contain')}
            src={`${publicImgPath}/${assetName}.webp`}
          />
        </Box>

        <Text variant="h5" align="center" weight="bold" customStyle="mt-2">
          {introLabel}
        </Text>

        <Text align="start" customStyle="mt-2">
          {descriptionLabel}
        </Text>

        <Button
          size="md"
          customStyle="self-end mt-6"
          variant="primary"
          label={ctaButtonLabel}
          onClick={onCTAButtonClick}
        />
      </Box>
    </BasicCardBox>
  );
};
