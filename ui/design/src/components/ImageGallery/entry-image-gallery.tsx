import * as React from 'react';
import { MoreImagesPill } from './more-images-pill';
import { ImageGridItem, ImageObject } from './image-grid-item';
import { SingleImageContainer, StyledGrid } from './index';

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

  const hiddenImagesNumber = React.useMemo(() => images.length - 4, [images]);

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
      {images.length > 4 && (
        <MoreImagesPill
          hiddenImages={hiddenImagesNumber}
          imageLabel={imageLabel}
          imagesLabel={imagesLabel}
        />
      )}
    </StyledGrid>
  );
};

export { EntryImageGallery };
