import React from 'react';
import { Anchor, Box, Text, Image } from 'grommet';

import Icon from '../Icon';
import { BasicCardBox } from '../EntryCard/basic-card-box';
import { useViewportSize } from '../Providers/viewport-dimension';

export type OverviewCTA = {
  label: string;
  url: string;
  iconType: string;
};

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
  overviewCTAArr?: OverviewCTA[];
  onCodeOfConductClick?: () => void;
}

const ModerationIntroCard: React.FC<IModerationIntroCardProps> = props => {
  const {
    assetName = 'moderation',
    titleLabel,
    subtitleLabel,
    isIntro = true,
    publicImgPath = '/images',
    introLabel,
    descriptionLine1Label,
    ctaLabel,
    ctaUrl,
    descriptionLine2IntroLabel,
    descriptionLine2Label,
    codeOfConductLabel,
    overviewCTAArr,
    onCodeOfConductClick,
  } = props;

  const { size } = useViewportSize();

  return (
    <BasicCardBox>
      <Box align="start" fill="horizontal" pad="medium" gap="xsmall">
        <Box>
          <Text size="xlarge" weight="bold">
            {titleLabel}
          </Text>
          <Text color="secondaryText">{subtitleLabel}</Text>
        </Box>

        {isIntro && (
          <Box
            fill="horizontal"
            pad={{ top: 'medium', horizontal: 'medium', bottom: 'small' }}
            gap="small"
          >
            <Box height="10rem" width="10rem" alignSelf="center">
              <Image fit="contain" src={`${publicImgPath}/${assetName}.webp`} />
            </Box>

            {introLabel && (
              <Text size="large" textAlign="center" weight="bold">
                {introLabel}
              </Text>
            )}

            {descriptionLine1Label && (
              <Text
                size="large"
                color="secondaryText"
                textAlign="center"
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
            )}

            {descriptionLine2IntroLabel && (
              <Text
                size="large"
                color="secondaryText"
                textAlign="center"
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
            )}

            {overviewCTAArr && overviewCTAArr.length > 0 && (
              <Box direction="row" justify={size === 'small' ? 'between' : 'around'}>
                {overviewCTAArr.map(({ url, label, iconType }, idx) => (
                  <Box
                    key={label + idx}
                    width={size === 'small' ? '30%' : '18%'}
                    align="center"
                    gap="xsmall"
                  >
                    <Icon size="md" type={iconType} />
                    <Anchor
                      href={url}
                      size="large"
                      weight="normal"
                      target="_blank"
                      color="accentText"
                      style={{ textDecoration: 'none', textAlign: 'center' }}
                    >
                      {label}
                    </Anchor>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </BasicCardBox>
  );
};

export default ModerationIntroCard;
