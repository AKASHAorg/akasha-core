import React from 'react';
import { Box, Text, Image } from 'grommet';

interface IListEmpty {
  assetName?: string;
  publicImgPath?: string;
  placeholderTitleLabel?: string;
  placeholderSubtitleLabel?: string;
}

const ListEmpty: React.FC<IListEmpty> = props => {
  const {
    assetName,
    publicImgPath = '/images',
    placeholderTitleLabel,
    placeholderSubtitleLabel,
  } = props;

  return (
    <Box margin="auto">
      <Box width="100%" height="20rem" margin={{ bottom: 'small' }} align="center">
        <Image width="50%" fit="contain" src={`${publicImgPath}/${assetName}.png`} />
        <Text weight={600} margin={{ top: '2.5rem' }} size="xlarge">
          {placeholderTitleLabel}
        </Text>
        <Text
          color="secondaryText"
          margin={{ top: '0.75rem' }}
          size="large"
          style={{ lineHeight: '1.6' }}
        >
          {placeholderSubtitleLabel}
        </Text>
      </Box>
    </Box>
  );
};

export default ListEmpty;
