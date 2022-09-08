import * as React from 'react';
import styled from 'styled-components';
import { Box, Text } from 'grommet';
import { ImageGridItem, ImageObject } from './image-grid-item';
import { SingleImageContainer, StyledGrid } from './index';

const StyledPill = styled(Box)`
  position: absolute;
  bottom: 21px;
  right: 16px;
  z-index: 1;
`;

export interface IImageGallery {
  imagesLabel?: string;
  imageLabel?: string;
  images: ImageObject[];
  handleDeleteImage?: (image: ImageObject) => void;
  handleClickImage?: (image: ImageObject) => void;
}

const EntryImageGallery: React.FC<IImageGallery> = props => {
  const { imagesLabel, imageLabel, images, handleDeleteImage, handleClickImage } = props;

  const renderSingleImage = React.useMemo(() => {
    return images?.length === 1;
  }, [images]);

  const MoreImagesPill = () => {
    const hiddenImages = images.length - 4;
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

  // limit shown images to 4
  const displayedImages = React.useMemo(() => {
    return images.slice(0, 4);
  }, [images]);

  if (renderSingleImage) {
    return (
      <SingleImageContainer>
        {images.map((image, index) => (
          <ImageGridItem
            image={image}
            key={index}
            handleDeleteImage={handleDeleteImage}
            handleClickImage={handleClickImage}
            images={images}
          />
        ))}
      </SingleImageContainer>
    );
  }
  return (
    <StyledGrid>
      {displayedImages.map((image, index) => (
        <ImageGridItem
          image={image}
          key={index}
          handleDeleteImage={handleDeleteImage}
          handleClickImage={handleClickImage}
          images={images}
        />
      ))}
      {images.length > 4 && <MoreImagesPill />}
    </StyledGrid>
  );
};

EntryImageGallery.defaultProps = {
  imagesLabel: 'images',
  imageLabel: 'image',
};

export { EntryImageGallery };
