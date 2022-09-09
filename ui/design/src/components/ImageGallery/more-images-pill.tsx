import * as React from 'react';
import styled from 'styled-components';
import { Box, Text } from 'grommet';

const StyledPill = styled(Box)`
  position: absolute;
  bottom: 21px;
  right: 16px;
  z-index: 1;
`;

export interface IMoreImagesPill {
  imageLabel?: string;
  imagesLabel?: string;
  hiddenImages: number;
}

export const MoreImagesPill: React.FC<IMoreImagesPill> = ({
  hiddenImages,
  imageLabel,
  imagesLabel,
}) => {
  const label = hiddenImages > 1 ? imagesLabel : imageLabel;
  return (
    <StyledPill
      direction="row"
      round="large"
      background={{ color: 'accent' }}
      fill="horizontal"
      width={{ max: '6rem' }}
      height="1.5rem"
      align="center"
      justify="center"
    >
      <Text color="white">{`+${hiddenImages} ${label}`}</Text>
    </StyledPill>
  );
};

MoreImagesPill.defaultProps = {
  imagesLabel: 'images',
  imageLabel: 'image',
};
