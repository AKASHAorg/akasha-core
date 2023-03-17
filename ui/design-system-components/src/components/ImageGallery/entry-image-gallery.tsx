import * as React from 'react';
import { tw } from '@twind/core';
import { MoreImagesPill } from './more-images-pill';
import { ImageGridItem, ImageObject } from './image-grid-item';

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
      <div className={tw('flex')}>
        {images.map((image, index) => (
          <ImageGridItem
            image={image}
            key={index}
            handleDeleteImage={handleDeleteImage}
            handleClickImage={handleClickImage}
            images={images}
          />
        ))}
      </div>
    );
  }
  return (
    <div className={tw('grid grid-cols-6 gap-1')}>
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
    </div>
  );
};

export { EntryImageGallery };
