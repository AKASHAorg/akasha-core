import * as React from 'react';
import { tw, apply, tx } from '@twind/core';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Portal } from '../Editor/helpers';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { type ImageObject } from '@akashaorg/typings/lib/ui';

export interface IImageOverlay {
  clickedImg: ImageObject;
  images: ImageObject[];
  closeModal: () => void;
}

const closeDivClass = apply(
  'flex items-center justify-center z-1 w-12 h-12 rounded-full bg(grey9 dark:grey3)',
);

/**
 * renders the full screen image modal that is triggered on image click
 */
const ImageOverlay: React.FC<IImageOverlay> = props => {
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
      <Stack customStyle="fixed top-0 w-screen h-screen bg-black/80 z-20">
        <Stack direction="row" customStyle="justify-end sm:justify-between p-4 sm:p-12">
          <Stack direction="row" spacing="gap-3">
            {images.length > 1 && (
              <button className={tx(`${closeDivClass}`)} onClick={handlePrevImg}>
                <Icon icon={<ArrowLeftIcon />} accentColor />
              </button>
            )}
            {images.length > 1 && (
              <button className={tx(`${closeDivClass}`)} onClick={handleNextImg}>
                <Icon icon={<ArrowRightIcon />} accentColor />
              </button>
            )}
          </Stack>

          <Stack direction="row" spacing="gap-3">
            <button className={tx(`${closeDivClass}`)} onClick={handleZoomIn}>
              <Icon icon={<MagnifyingGlassPlusIcon />} accentColor />
            </button>
            <button className={tx(`${closeDivClass}`)} onClick={handleZoomOut}>
              <Icon icon={<MagnifyingGlassMinusIcon />} accentColor />
            </button>
            <button className={tx(`${closeDivClass}`)} onClick={closeModal}>
              <Icon icon={<XMarkIcon />} accentColor />
            </button>
          </Stack>
        </Stack>
        {currentImg && (
          <Stack customStyle="h-full" align="center" justify="center">
            <TransformWrapper
              ref={transformRef}
              centerOnInit={true}
              centerZoomedOut={true}
              limitToBounds={true}
              disablePadding={true}
              panning={{ disabled: true }}
            >
              <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
                <picture className={tw(`flex`)}>
                  <img src={currentImg.src} alt="" />
                </picture>
              </TransformComponent>
            </TransformWrapper>
          </Stack>
        )}
      </Stack>
    </Portal>
  );
};

export default ImageOverlay;
