import React from 'react';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IArticleOnboardingIntroProps {
  assetName?: string;
  titleLabel: string;
  publicImgPath?: string;
  introLabel: string;
  descriptionLabel: string;
  buttonLabel: string;
  onStart: () => void;
}

export const ONBOARDING_STATUS = 'ewa-articles-app-onboarding-status';

const ArticleOnboardingIntro: React.FC<IArticleOnboardingIntroProps> = props => {
  const {
    assetName = 'articles',
    titleLabel,
    publicImgPath = '/images',
    introLabel,
    descriptionLabel,
    buttonLabel,
    onStart,
  } = props;

  return (
    <Card customStyle="mb-4">
      <Box customStyle="flex items-start w-full p-4">
        <Box customStyle="flex flex-row w-full justify-between mb-1">
          <Text variant="h2">{titleLabel}</Text>
        </Box>
        <Box customStyle="flex w-full p-4">
          <Box customStyle="h-40 w-40 mb-1 flex self-center">
            <Image customStyle="object-contain" src={`${publicImgPath}/${assetName}.webp`} />
          </Box>
          <Text variant="h6" align="center" customStyle="mb-1" weight="bold">
            {introLabel}
          </Text>
          <Text variant="subtitle1" align="center" customStyle="mb-1">
            {descriptionLabel}
          </Text>
        </Box>
        <Box customStyle="flex flex-row w-full justify-end items-center gap-2">
          {/* <Text size="large" style={{ cursor: 'pointer' }} onClick={onSkip}>
            {skipLabel}
          </Text> */}
          <Button size="lg" variant="primary" label={buttonLabel} onClick={onStart} />
        </Box>
      </Box>
    </Card>
  );
};

export default ArticleOnboardingIntro;
