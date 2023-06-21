import React from 'react';
import DS from '@akashaorg/design-system';

const { Box, Text, Image } = DS;

export type HeroImageCardProps = {
  assetName?: string;
  assetExtension?: string;
  publicImgPath?: string;
  wrapperBoxWidth?: string;
  wrapperBoxHeight?: string;
  wrapperBoxMargin?: Record<string, unknown>;
  titleLabel: string;
  subtitleLabel: string;
};

const HeroImageCard: React.FC<HeroImageCardProps> = props => {
  const {
    assetName = 'ok',
    assetExtension = 'webp',
    publicImgPath = '/images',
    wrapperBoxWidth = '16rem',
    wrapperBoxHeight = '13rem',
    wrapperBoxMargin = { bottom: 'medium' },
    titleLabel,
    subtitleLabel,
  } = props;

  return (
    <Box gap="small">
      <Box
        width={wrapperBoxWidth}
        height={wrapperBoxHeight}
        margin={wrapperBoxMargin}
        alignSelf="center"
      >
        <Image fit="contain" src={`${publicImgPath}/${assetName}.${assetExtension}`} />
      </Box>
      {titleLabel && (
        <Text size="large" weight="bold" textAlign="center">
          {titleLabel}
        </Text>
      )}
      <Text size="large" textAlign="center">
        {subtitleLabel}
      </Text>
    </Box>
  );
};

export default HeroImageCard;
