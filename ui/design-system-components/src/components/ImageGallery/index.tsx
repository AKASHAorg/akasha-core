import * as React from 'react';
import { tw, css, apply } from '@twind/core';
import { ImageGridItem, ImageObject } from './image-grid-item';

export interface IImageGallery {
  images: ImageObject[];
  handleDeleteImage?: (image: ImageObject) => void;
  handleClickImage?: (image: ImageObject) => void;
}

const ImageGallery: React.FC<IImageGallery> = props => {
  const { images, handleDeleteImage, handleClickImage } = props;

  const hideScrollbarStyles = css({
    '::-webkit-scrollbar': { display: 'none' },
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
  });
  const mobileStyle = apply(`flex flex-row overflow-auto whitespace-nowrap ${hideScrollbarStyles}`);
  const desktopStyle = apply(`grid grid-cols-6 gap-1`);

  if (images.length === 1) {
    return (
      <div className={tw('flex')}>
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
      </div>
    );
  }
  return (
    <div className={tw(`${mobileStyle} sm:${desktopStyle}`)}>
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
    </div>
  );
};

export default ImageGallery;
