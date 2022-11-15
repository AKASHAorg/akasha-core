import React from 'react';
import { Anchor, Box, Text, Image } from 'grommet';

import { BasicCardBox } from '../EntryCard/basic-card-box';

export interface IModerationIntroCardProps {
  assetName?: string;
  titleLabel: string;
  subtitleLabel: string;
  isIntro?: boolean;
  publicImgPath?: string;
  introLabel?: string;
  descriptionLine1Label?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  descriptionLine2IntroLabel?: string;
  descriptionLine2Label?: string;
  codeOfConductLabel?: string;
  onCodeOfConductClick?: () => void;
}

const ModerationIntroCard: React.FC<IModerationIntroCardProps> = props => {
  const {
    assetName = 'moderation',
    titleLabel,
    subtitleLabel,
    isIntro,
    publicImgPath = '/images',
    introLabel,
    descriptionLine1Label,
    ctaLabel,
    ctaUrl,
    descriptionLine2IntroLabel,
    descriptionLine2Label,
    codeOfConductLabel,
    onCodeOfConductClick,
  } = props;

  return (
    <BasicCardBox margin={{ ...(!isIntro && { bottom: '1rem' }) }}>
      <Box align="start" fill="horizontal" pad="medium">
        <Box direction="row" fill="horizontal" justify="between" margin={{ bottom: 'xsmall' }}>
          <Text size="xlarge" weight="bold">
            {titleLabel}
          </Text>
        </Box>
        <Text color="secondaryText">{subtitleLabel}</Text>
        {isIntro && (
          <Box fill="horizontal" pad="medium">
            <Box height="10rem" width="10rem" margin={{ bottom: 'small' }} alignSelf="center">
              <Image fit="contain" src={`${publicImgPath}/${assetName}.webp`} />
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
              {descriptionLine1Label}
              {ctaLabel && (
                <Anchor
                  href={ctaUrl}
                  size="large"
                  weight="normal"
                  target="_blank"
                  color="accentText"
                  margin={{ left: '0.2rem' }}
                  style={{ textDecoration: 'none' }}
                >
                  {ctaLabel}
                </Anchor>
              )}
            </Text>
            <Text
              size="large"
              color="secondaryText"
              textAlign="center"
              margin={{ bottom: 'xsmall' }}
              style={{ lineHeight: '1.5' }}
            >
              {descriptionLine2IntroLabel}
              {codeOfConductLabel && (
                <Text
                  as="span"
                  size="large"
                  margin={{ horizontal: '0.2rem' }}
                  color="accentText"
                  style={{ cursor: 'pointer' }}
                  onClick={onCodeOfConductClick}
                >
                  {codeOfConductLabel}
                </Text>
              )}
              {descriptionLine2Label}
            </Text>
          </Box>
        )}
      </Box>
    </BasicCardBox>
  );
};

export default ModerationIntroCard;
