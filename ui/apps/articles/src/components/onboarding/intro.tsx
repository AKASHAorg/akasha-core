import React from 'react';
import DS from '@akashaorg/design-system';

const { Box, Button, Text, Image, MainAreaCardBox } = DS;

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
    <MainAreaCardBox margin={{ bottom: '1rem' }}>
      <Box align="start" fill="horizontal" pad="medium">
        <Box direction="row" fill="horizontal" justify="between" margin={{ bottom: 'xsmall' }}>
          <Text size="xlarge" weight="bold">
            {titleLabel}
          </Text>
        </Box>
        <Box fill="horizontal" pad="medium">
          <Box height="10rem" width="10rem" margin={{ bottom: 'small' }} alignSelf="center">
            <Image fit="contain" src={`${publicImgPath}/${assetName}.png`} />
          </Box>
          <Text size="large" textAlign="center" margin={{ bottom: 'xsmall' }} weight="bold">
            {introLabel}
          </Text>
          <Text
            size="large"
            color="secondaryText"
            textAlign="center"
            margin={{ bottom: 'xsmall' }}
            style={{ lineHeight: '1.5' }}
          >
            {descriptionLabel}
          </Text>
        </Box>
        <Box direction="row" fill="horizontal" justify="end" align="center" gap="small">
          {/* <Text size="large" style={{ cursor: 'pointer' }} onClick={onSkip}>
            {skipLabel}
          </Text> */}
          <Button size="large" height={2.5} primary={true} label={buttonLabel} onClick={onStart} />
        </Box>
      </Box>
    </MainAreaCardBox>
  );
};

export default ArticleOnboardingIntro;
