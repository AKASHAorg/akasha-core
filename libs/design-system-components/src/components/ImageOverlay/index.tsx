import * as React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { MoveLeftIcon, MoveRightIcon, ZoomOutIcon, ZoomInIcon, XIcon } from 'lucide-react';
import { Portal } from '../../utils/portal';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { type GalleryImage } from '@akashaorg/typings/lib/ui';

export interface IImageOverlay {
  clickedImg: GalleryImage;
  images: GalleryImage[];
  closeModal: () => void;
}

const closeDivClass =
  'flex items-center justify-center z-1 w-12 h-12 rounded-full bg-grey9 dark:bg-grey3';

/**
 * Component that renders the full screen image modal that is triggered on image click
 * @param images - list of images
 * @param clickedImg -  image that was clicked to open the overlay
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
    const currImgIndex = images.findIndex(image => image.src === currentImg.src);
    const prevIndex = currImgIndex > 0 ? images[currImgIndex - 1] : images[images.length - 1];
    setCurrentImg(prevIndex);
  }, [currentImg, images]);

  const handleNextImg = React.useCallback(() => {
    const currImgIndex = images.findIndex(image => image.src === currentImg.src);
    const nextIndex = currImgIndex < images.length - 1 ? images[currImgIndex + 1] : images[0];
    setCurrentImg(nextIndex);
  }, [currentImg, images]);

  const [imgLoaded, setImgLoaded] = React.useState(false);

  const handleImageOnLoad = () => {
    transformRef.current?.resetTransform();
    setImgLoaded(true);
  };

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
      <Stack className="fixed top-0 w-screen h-screen bg-black/80 z-[105]">
        <Stack direction="row" className="justify-end sm:justify-between p-4 sm:p-12">
          <Stack direction="row" spacing={3}>
            {images.length > 1 && (
              <button className={`${closeDivClass}`} onClick={handlePrevImg}>
                <MoveLeftIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
              </button>
            )}
            {images.length > 1 && (
              <button className={`${closeDivClass}`} onClick={handleNextImg}>
                <MoveRightIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
              </button>
            )}
          </Stack>

          <Stack direction="row" spacing={3}>
            <button className={`${closeDivClass}`} onClick={handleZoomIn}>
              <ZoomInIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
            </button>
            <button className={`${closeDivClass}`} onClick={handleZoomOut}>
              <ZoomOutIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
            </button>
            <button className={`${closeDivClass}`} onClick={closeModal}>
              <XIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
            </button>
          </Stack>
        </Stack>
        {currentImg && (
          <Stack alignItems="center" justifyContent="center" className="h-full">
            <TransformWrapper
              key={currentImg.src}
              ref={transformRef}
              centerOnInit={true}
              centerZoomedOut={false}
              limitToBounds={true}
              disablePadding={true}
              panning={{ disabled: true }}
              alignmentAnimation={{ animationTime: 0 }}
            >
              <TransformComponent wrapperStyle={{ height: '100%', width: '100%' }}>
                <img
                  className={`block max-w-full max-h-full ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  loading="lazy"
                  decoding="async"
                  src={currentImg.src}
                  alt={currentImg.src}
                  onLoad={handleImageOnLoad}
                />
              </TransformComponent>
            </TransformWrapper>
          </Stack>
        )}
      </Stack>
    </Portal>
  );
};

export default ImageOverlay;
