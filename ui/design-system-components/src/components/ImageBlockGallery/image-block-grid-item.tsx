import * as React from 'react';
import { apply, tw, tx } from '@twind/core';
import { DelayLoad } from '../../utils/delay-load';
import { type ImageObject } from '@akashaorg/typings/lib/ui';

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

  const multipleImageStyle = apply`${images.length > 1 && 'aspect-square'}`;
  const heightStyle = apply`${images.length === 1 && 'max-h-40 sm:max-h-60'}`;

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
        <source srcSet={imageSrc?.originalSrc} />

        <img
          alt={imageSrc?.src}
          className={tx(`rounded object-cover w-full ${heightStyle} ${multipleImageStyle}`)}
          src={imageSrc?.src}
          onLoad={() => setImgLoaded(true)}
          hidden={!imgLoaded}
          height={images.length === 1 ? imageSrc?.size?.height : ''}
        />
      </picture>

      {!imgLoaded && (
        <DelayLoad>
          <div className={tw('flex')}>
            <img
              alt={'placeholder'}
              className={tx(`rounded object-cover w-full  ${heightStyle} ${multipleImageStyle}`)}
              src={'/images/image-placeholder.webp'}
              height={images.length === 1 ? imageSrc?.size?.height : ''}
            />
          </div>
        </DelayLoad>
      )}
    </button>
  );
};
