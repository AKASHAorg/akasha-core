import * as React from 'react';
import { apply, tw, tx } from '@twind/core';
import { DelayLoad } from '../../utils/delay-load';
import { ImageObject } from '@akashaorg/typings/lib/ui';

export interface IGridItemProps {
  image: ImageObject;
  images: ImageObject[];
  handleClickImage: (image: ImageObject) => void;
}

export const ImageBlockGridItem: React.FC<IGridItemProps> = props => {
  const { image, images, handleClickImage } = props;

  const imageSrc = React.useMemo(() => image, [image]);

  const [imgLoaded, setImgLoaded] = React.useState(false);

  const getGridSpan = () => {
    switch (images.length) {
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

  const singleImageStyle = apply`${images.length === 1 && 'max-w-full'}`;
  const mobileStyle = apply`${'h-40 sm:max-h-60'}`;

  return (
    <button
      className={tw('flex relative border(solid grey1) rounded')}
      style={style}
      onClick={ev => {
        if (handleClickImage && typeof handleClickImage === 'function' && imgLoaded) {
          handleClickImage(imageSrc);
        }
        ev.stopPropagation();
        ev.preventDefault();
        return false;
      }}
    >
      {/* when we have a single image we need to keep the original aspect ratio,
          otherwise give images a 1:1 ratio */}
      <picture className={tw('flex')}>
        <source srcSet={imageSrc.originalSrc} />
        <source srcSet={imageSrc.src.url} />
        <img
          alt={imageSrc.src.fallbackUrl}
          className={tx(
            `rounded object-cover w-full aspect-square ${mobileStyle} ${singleImageStyle}`,
          )}
          src={imageSrc.src.fallbackUrl}
          onLoad={() => setImgLoaded(true)}
          hidden={!imgLoaded}
        />
      </picture>
      {!imgLoaded && (
        <DelayLoad>
          <div className={tw('flex')}>
            <img
              alt={'placeholder'}
              className={tx(
                `rounded object-cover w-full aspect-square ${mobileStyle} ${singleImageStyle}`,
              )}
              src={'/images/image-placeholder.webp'}
              height={images.length === 1 ? image.size.height : ''}
            />
          </div>
        </DelayLoad>
      )}
    </button>
  );
};
