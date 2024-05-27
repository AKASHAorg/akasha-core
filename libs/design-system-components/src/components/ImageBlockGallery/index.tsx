import * as React from 'react';
import { tw, apply } from '@twind/core';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ArrowPathIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { ImageBlockGridItem } from './image-block-grid-item';
import ImageOverlay from '../ImageOverlay';
import { type ImageObject } from '@akashaorg/typings/lib/ui';

export interface IImageGallery {
  images: ImageObject[];
  uploading?: boolean;
  gap?: number;
}

const ImageBlockGallery: React.FC<IImageGallery> = props => {
  const { images, uploading, gap = 1 } = props;

  const [showOverlay, setShowOverlay] = React.useState(false);
  const [clickedImg, setClickedImg] = React.useState(null);

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleClickImage = (img: ImageObject) => {
    setShowOverlay(true);
    setClickedImg(img);
  };

  const gridStyle = apply(`grid grid-cols-6 gap-${gap}`);

  const getGridSpan = () => {
    switch (uploading ? images.length + 1 : images.length) {
      case 1:
        return 6;
      case 3:
        return 2;
      default:
        return 3;
    }
  };

  const style = {
    gridColumnEnd: `span ${getGridSpan()}`,
    gridRowEnd: `span ${getGridSpan()}`,
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
          />
        ))}
        {uploading && (
          <div className={tw('flex relative border(solid grey1) rounded')} style={style}>
            <Stack
              customStyle={`rounded h-full w-[${images[0]?.size?.height}px] max-w-max aspect-square `}
              justify="center"
              align="center"
              background={{ light: 'grey8', dark: 'grey5' }}
            >
              <Icon icon={<ArrowPathIcon />} rotateAnimation />
            </Stack>
          </div>
        )}
      </div>
      {showOverlay && (
        <ImageOverlay images={images} clickedImg={clickedImg} closeModal={handleCloseOverlay} />
      )}
    </>
  );
};

export default ImageBlockGallery;
