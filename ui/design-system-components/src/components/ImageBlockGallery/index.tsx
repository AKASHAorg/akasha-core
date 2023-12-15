import * as React from 'react';
import { tw, apply } from '@twind/core';
import { ImageBlockGridItem } from './image-block-grid-item';
import ImageOverlay from '../ImageOverlay';
import { type ImageObject } from '@akashaorg/typings/lib/ui';

export interface IImageGallery {
  images: ImageObject[];
}

const ImageBlockGallery: React.FC<IImageGallery> = props => {
  const { images } = props;

  const [showOverlay, setShowOverlay] = React.useState(false);
  const [clickedImg, setClickedImg] = React.useState(null);

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleClickImage = (img: ImageObject) => {
    setShowOverlay(true);
    setClickedImg(img);
  };

  const gridStyle = apply(`grid grid-cols-6 gap-1`);

  return (
    <>
      <div className={images.length === 1 ? tw('flex') : tw(`${gridStyle}`)}>
        {images.map((image, index) => (
          <ImageBlockGridItem
            image={image}
            key={index}
            handleClickImage={handleClickImage}
            images={images}
          />
        ))}
      </div>
      {showOverlay && (
        <ImageOverlay images={images} clickedImg={clickedImg} closeModal={handleCloseOverlay} />
      )}
    </>
  );
};

export default ImageBlockGallery;
