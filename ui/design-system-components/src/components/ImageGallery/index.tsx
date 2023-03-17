import * as React from 'react';
import { tw, css } from '@twind/core';
import { isMobile } from 'react-device-detect';
import { ImageGridItem, ImageObject } from './image-grid-item';

const hideScrollbarStyles = css({
  '::-webkit-scrollbar': { display: 'none' },
  '-ms-overflow-style': 'none',
  'scrollbar-width': 'none',
});

export interface IImageGallery {
  images: ImageObject[];
  handleDeleteImage?: (image: ImageObject) => void;
  handleClickImage?: (image: ImageObject) => void;
}

const ImageGallery: React.FC<IImageGallery> = props => {
  const { images, handleDeleteImage, handleClickImage } = props;

  if (isMobile) {
    return (
      <div className={tw(`flex flex-row overflow-auto whitespace-nowrap ${hideScrollbarStyles}`)}>
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
    <div className={tw('grid grid-cols-6 gap-1')}>
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
