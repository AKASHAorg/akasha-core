import * as React from 'react';
import { tw, apply } from '@twind/core';
import { ImageBlockGridItem } from './image-block-grid-item';
import { ImageObject } from '@akashaorg/typings/lib/ui';

export interface IImageGallery {
  images: ImageObject[];
  handleDeleteImage?: (image: ImageObject) => void;
  handleClickImage?: (image: ImageObject) => void;
}

const ImageBlockGallery: React.FC<IImageGallery> = props => {
  const { images, handleClickImage } = props;

  const gridStyle = apply(`grid grid-cols-6 gap-1`);

  if (images.length === 1) {
    return (
      <div className={tw('flex')}>
        {images.map((image, index) => (
          <ImageBlockGridItem
            image={image}
            key={index}
            handleClickImage={handleClickImage}
            images={images}
          />
        ))}
      </div>
    );
  }
  return (
    <div className={tw(`${gridStyle}`)}>
      {images.map((image, index) => (
        <ImageBlockGridItem
          image={image}
          key={index}
          handleClickImage={handleClickImage}
          images={images}
        />
      ))}
    </div>
  );
};

export default ImageBlockGallery;
