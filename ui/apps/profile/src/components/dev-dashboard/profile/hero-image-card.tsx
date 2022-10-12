import React from 'react';
import DS from '@akashaorg/design-system';

const { Box, Text, Image } = DS;

export interface IHeroImageCard {
  assetName?: string;
  assetExtension?: string;
  publicImgPath?: string;
  titleLabel: string;
  subtitleLabel: string;
}

const HeroImageCard: React.FC<IHeroImageCard> = props => {
  const {
    assetName = 'ok',
    assetExtension = 'png',
    publicImgPath = '/images',
    titleLabel,
    subtitleLabel,
  } = props;

  return (
    <Box gap="small">
      <Box height="13rem" width="16rem" margin={{ bottom: 'medium' }} alignSelf="center">
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
