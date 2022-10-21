import React from 'react';
import DS from '@akashaorg/design-system';

const { Box, Image, Text, BasicCardBox } = DS;

interface INoProfileFoundProps {
  assetName?: string;
  titleLabel: string;
  subtitleLine1Label: string;
  subtitleLine2Label: string;
  publicImgPath?: string;
  cta1Label: string;
  cta2Label: string;
  onGoToFeedClick: () => void;
  onCTAClick: () => void;
}

const NoProfileFound: React.FC<INoProfileFoundProps> = props => {
  const {
    assetName = 'no-profile-found',
    titleLabel,
    subtitleLine1Label,
    subtitleLine2Label,
    publicImgPath = '/images',
    cta1Label,
    cta2Label,
    onGoToFeedClick,
    onCTAClick,
  } = props;
  return (
    <BasicCardBox>
      <Box fill="horizontal" pad="medium">
        <Box height="17.5rem" width="17.5rem" margin={{ bottom: 'small' }} alignSelf="center">
          <Image fit="contain" src={`${publicImgPath}/${assetName}.png`} />
        </Box>
        <Text size="large" textAlign="center" margin={{ bottom: 'xsmall' }} weight="bold">
          {titleLabel}
        </Text>
        <Text
          size="large"
          color="secondaryText"
          textAlign="center"
          margin={{ bottom: 'xsmall' }}
          style={{ lineHeight: '1.5' }}
        >
          {subtitleLine1Label}{' '}
          <Text
            size="large"
            color="accentText"
            textAlign="center"
            style={{ cursor: 'pointer' }}
            onClick={onGoToFeedClick}
          >
            {cta1Label}
          </Text>{' '}
          {subtitleLine2Label}{' '}
          <Text
            size="large"
            color="accentText"
            textAlign="center"
            style={{ cursor: 'pointer' }}
            onClick={onCTAClick}
          >
            {cta2Label}
          </Text>
        </Text>
      </Box>
    </BasicCardBox>
  );
};

export default NoProfileFound;
