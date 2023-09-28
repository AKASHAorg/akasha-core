import React from 'react';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ArticleOnboardingIntroProps = {
  assetName?: string;
  assetExtension?: string;
  publicImgPath?: string;
  titleLabel: string;
  introLabel: string;
  descriptionLabel: string;
  buttonLabel: string;
  onStart: () => void;
};

export const ONBOARDING_STATUS = 'ewa-articles-app-onboarding-status';

const ArticleOnboardingIntro: React.FC<ArticleOnboardingIntroProps> = props => {
  const {
    assetName = 'articles',
    titleLabel,
    assetExtension = 'webp',
    publicImgPath = '/images',
    introLabel,
    descriptionLabel,
    buttonLabel,
    onStart,
  } = props;

  return (
    <Card customStyle="mb-4">
      <Stack align="start" fullWidth={true} customStyle="p-4">
        <Stack direction="row" fullWidth={true} justify="between" customStyle="mb-1">
          <Text variant="h2">{titleLabel}</Text>
        </Stack>
        <Stack fullWidth={true} customStyle="p-4">
          <Stack customStyle="h-40 w-40 mb-1 flex self-center">
            <Image
              customStyle="object-contain"
              src={`${publicImgPath}/${assetName}.${assetExtension}`}
            />
          </Stack>
          <Text variant="h6" align="center" customStyle="mb-1" weight="bold">
            {introLabel}
          </Text>
          <Text variant="subtitle1" align="center" customStyle="mb-1">
            {descriptionLabel}
          </Text>
        </Stack>
        <Stack direction="row" fullWidth={true} align="center" justify="end" spacing="gap-2">
          {/* <Text size="large" style={{ cursor: 'pointer' }} onClick={onSkip}>
            {skipLabel}
          </Text> */}
          <Button size="lg" variant="primary" label={buttonLabel} onClick={onStart} />
        </Stack>
      </Stack>
    </Card>
  );
};

export default ArticleOnboardingIntro;
