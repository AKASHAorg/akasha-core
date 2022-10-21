import React from 'react';
import DS from '@akashaorg/design-system';

const { Box, Image, Text, BasicCardBox } = DS;

interface IDevDashOnboardingIntroProps {
  assetName?: string;
  titleLabel: string;
  introLabel: string;
  descriptionLabel: string;
  publicImgPath?: string;
  ctaLabel: string;
  onCTAClick: () => void;
}

export const ONBOARDING_STATUS = 'ewa-dev-dashboard-onboarding-status';

const DevDashOnboardingIntro: React.FC<IDevDashOnboardingIntroProps> = props => {
  const {
    assetName = 'dev-dashboard-intro',
    titleLabel,
    introLabel,
    descriptionLabel,
    publicImgPath = '/images',
    ctaLabel,
    onCTAClick,
  } = props;

  return (
    <BasicCardBox>
      <Box align="start" fill="horizontal" pad="medium">
        <Box direction="row" fill="horizontal" justify="between" margin={{ bottom: 'xsmall' }}>
          <Text size="xlarge" weight="bold">
            {titleLabel}
          </Text>
        </Box>
        <Box fill="horizontal" pad="medium">
          <Box height="17.5rem" width="17.5rem" margin={{ bottom: 'small' }} alignSelf="center">
            <Image fit="contain" src={`${publicImgPath}/${assetName}.png`} />
          </Box>
          <Text size="large" textAlign="center" margin={{ bottom: 'xsmall' }} weight="bold">
            {introLabel}
          </Text>
          <Text
            size="large"
            color="secondaryText"
            textAlign="start"
            margin={{ bottom: 'xsmall' }}
            style={{ lineHeight: '1.5' }}
          >
            {descriptionLabel}
          </Text>
          <Text
            size="large"
            color="accentText"
            textAlign="end"
            margin={{ top: '2.625rem' }}
            style={{ cursor: 'pointer' }}
            onClick={onCTAClick}
          >
            {ctaLabel}
          </Text>
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default DevDashOnboardingIntro;
