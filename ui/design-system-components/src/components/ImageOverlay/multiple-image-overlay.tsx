import * as React from 'react';
import { tw, apply, tx } from '@twind/core';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Portal } from '../Editor/helpers';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ImageObject } from '../ImageGallery/image-grid-item';

export interface IImageOverlay {
  clickedImg: ImageObject;
  images: ImageObject[];
  closeModal: () => void;
}

const closeDivClass = apply(
  'flex items-center justify-items-center z-1 w-6 h-6 rounded-full bg-grey7',
);
const flexCenteredClass = apply(`flex items-center justify-items-center`);

/**
 * renders the full screen image modal that is triggered on image click
 */
const MultipleImageOverlay: React.FC<IImageOverlay> = props => {
  const { clickedImg, images, closeModal } = props;

  const [currentImg, setCurrentImg] = React.useState(clickedImg);

  const transformRef = React.useRef(null);

  const handleZoomIn = () => {
    if (transformRef) {
      transformRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    transformRef.current.zoomOut();
  };

  const handlePrevImg = React.useCallback(() => {
    const currImgIndex = images.indexOf(currentImg);
    const prevIndex = currImgIndex > 0 ? images[currImgIndex - 1] : images[images.length - 1];
    setCurrentImg(prevIndex);
  }, [currentImg, images]);

  const handleNextImg = React.useCallback(() => {
    const currImgIndex = images.indexOf(currentImg);
    const nextIndex = currImgIndex < images.length - 1 ? images[currImgIndex + 1] : images[0];
    setCurrentImg(nextIndex);
  }, [currentImg, images]);

  React.useEffect(() => {
    const handler = ev => {
      if (ev.key === 'Escape') {
        closeModal();
      }
      if (ev.key === 'ArrowRight') {
        handleNextImg();
      }
      if (ev.key === 'ArrowLeft') {
        handlePrevImg();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images, currentImg, closeModal, handleNextImg, handlePrevImg]);

  return (
    <Portal>
      <div
        className={tw(`${flexCenteredClass} w-screen h-screen bg-grey3 z-20`)}
        onClick={(ev: React.SyntheticEvent) => {
          /**
           * prevents click bubbling to parent so the user doesn't get redirected
           */
          ev.stopPropagation();
        }}
      >
        <div className={tw(`flex flex-row gap-3 p-3 absolute top-1 right-1 z-1`)}>
          <div className={tx(`${closeDivClass}`)} onClick={handleZoomIn}>
            <Icon type="MagnifyingGlassPlusIcon" />
          </div>
          <div className={tx(`${closeDivClass}`)} onClick={handleZoomOut}>
            <Icon type="MagnifyingGlassMinusIcon" />
          </div>
          <div className={tx(`${closeDivClass}`)} onClick={closeModal}>
            <Icon type="XMarkIcon" />
          </div>
        </div>
        {images.length > 1 && (
          <div className={tw(`absolute left-2.5 top-1/2 z-1`)}>
            <div className={tx(`${closeDivClass}`)} onClick={handlePrevImg}>
              <Icon type="ArrowLeftIcon" />
            </div>
          </div>
        )}
        {images.length > 1 && (
          <div className={tw(`absolute right-2.5 top-1/2 z-1`)}>
            <div className={tx(`${closeDivClass}`)} onClick={handleNextImg}>
              <Icon type="ArrowRightIcon" />
            </div>
          </div>
        )}

        {currentImg && (
          <TransformWrapper ref={transformRef} centerOnInit={true} centerZoomedOut={true}>
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
              <picture className={tw(`flex`)}>
                <source srcSet={currentImg.src.url} />
                <img src={currentImg.src.fallbackUrl} alt="" />
              </picture>
            </TransformComponent>
          </TransformWrapper>
        )}
      </div>
    </Portal>
  );
};

export default MultipleImageOverlay;
