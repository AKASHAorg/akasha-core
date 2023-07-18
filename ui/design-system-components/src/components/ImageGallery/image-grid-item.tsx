import * as React from 'react';
import { apply, tw, tx } from '@twind/core';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { DelayLoad } from '../../utils/delay-load';

export interface ImageObject {
  originalSrc?: string;
  src: { url?: string; fallbackUrl?: string };
  size: { width: number; height: number; naturalWidth: number; naturalHeight: number };
  id: string;
}

export interface IGridItemProps {
  image: ImageObject;
  images: ImageObject[];
  handleClickImage: (image: ImageObject) => void;
  handleDeleteImage: (image: ImageObject) => void;
  editorStyle?: boolean;
}

export const ImageGridItem: React.FC<IGridItemProps> = props => {
  const { image, images, handleClickImage, handleDeleteImage, editorStyle } = props;

  const imageSrc = React.useMemo(() => image, [image]);

  const [imgLoaded, setImgLoaded] = React.useState(false);

  const getGridSpan = () => {
    if (editorStyle) {
      switch (images.length) {
        case 1:
          return 6;
        case 2:
          return 3;
        case 4:
          return 3;
        default:
          return 2;
      }
    } else {
      switch (images.length) {
        case 1:
          return 6;
        case 3:
          return 2;

        default:
          return 3;
      }
    }
  };

  const style = {
    gridColumnEnd: `span ${getGridSpan()}`,
    gridRowEnd: `span ${getGridSpan()}`,
  };

  const singleImageStyle = apply`${images.length === 1 && 'max-w-full'}`;
  const mobileStyle = apply`${editorStyle && 'h-40 pr-1 sm:h-full sm:pr-0'}`;

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
      {handleDeleteImage && (
        <button
          className={tw(
            'flex items-center justify-items-center z-1 absolute top-5 right-5 w-6 h-6 rounded-full bg-grey7',
          )}
          onClick={ev => {
            if (handleDeleteImage && typeof handleDeleteImage === 'function') {
              handleDeleteImage(imageSrc);
            }
            ev.stopPropagation();
            ev.preventDefault();
            return false;
          }}
        >
          <Icon type="TrashIcon" />
        </button>
      )}
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
