import * as React from 'react';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import { ImageGridItem, ImageObject } from './image-grid-item';

export const ScrollableContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow: auto;
  white-space: nowrap;
  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 0.3rem;
`;

export const SingleImageContainer = styled.div`
  display: flex;
`;

export interface IImageGallery {
  images: ImageObject[];
  handleDeleteImage?: (image: ImageObject) => void;
  handleClickImage?: (image: ImageObject) => void;
}

const ImageGallery: React.FC<IImageGallery> = props => {
  const { images, handleDeleteImage, handleClickImage } = props;

  if (isMobile) {
    return (
      <ScrollableContainer>
        {images.map((image, index) => (
          <ImageGridItem
            image={image}
            key={index}
            handleDeleteImage={handleDeleteImage}
            handleClickImage={handleClickImage}
            images={images}
            editorStyle={true}
          />
        ))}
      </ScrollableContainer>
    );
  }
  if (images.length === 1) {
    return (
      <SingleImageContainer>
        {images.map((image, index) => (
          <ImageGridItem
            image={image}
            key={index}
            handleDeleteImage={handleDeleteImage}
            handleClickImage={handleClickImage}
            images={images}
            editorStyle={true}
          />
        ))}
      </SingleImageContainer>
    );
  }
  return (
    <StyledGrid>
      {images.map((image, index) => (
        <ImageGridItem
          image={image}
          key={index}
          handleDeleteImage={handleDeleteImage}
          handleClickImage={handleClickImage}
          images={images}
          editorStyle={true}
        />
      ))}
    </StyledGrid>
  );
};

export default ImageGallery;
