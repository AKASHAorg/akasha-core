import * as React from 'react';
import { tw, apply } from '@twind/core';
import { ImageBlockGridItem } from '../ImageBlockGallery/image-block-grid-item';
import ImageOverlay from '../ImageOverlay';
import { type ImageObject } from '@akashaorg/typings/lib/ui';

export type ExtensionImageGalleryProps = {
  images: ImageObject[];
  showOverlay: boolean;
  toggleOverlay: () => void;
};

const ExtensionImageGallery: React.FC<ExtensionImageGalleryProps> = props => {
  const { images, showOverlay, toggleOverlay } = props;
  const [clickedImg, setClickedImg] = React.useState(null);

  const handleClickImage = (img: ImageObject) => {
    toggleOverlay();
    setClickedImg(img);
  };

  const gridStyle = apply(`grid grid-cols-6 gap-3`);

  const style = {
    gridColumnEnd: `span 2`,
    gridRowEnd: `span 2`,
  };

  return (
    <>
      <div className={images.length === 1 ? tw('flex') : tw(`${gridStyle}`)}>
        {images.map((image, index) => (
          <ImageBlockGridItem
            image={image}
            key={index}
            handleClickImage={handleClickImage}
            images={images}
            gridStyle={style}
            aspectRatio="aspect-video"
          />
        ))}
      </div>
      {showOverlay && (
        <ImageOverlay
          images={images}
          clickedImg={clickedImg ?? images[0]}
          closeModal={toggleOverlay}
        />
      )}
    </>
  );
};

export default ExtensionImageGallery;
