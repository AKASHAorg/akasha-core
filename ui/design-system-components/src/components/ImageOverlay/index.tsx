import * as React from 'react';
import { tw, apply, tx } from '@twind/core';
import ModalContainer from '@akashaorg/design-system-core/lib/components/ModalContainer';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Portal } from '../Editor/helpers';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export interface IImageOverlay {
  src: { url?: string; fallbackUrl?: string };
  closeModal: () => void;
}

const closeDivClass = apply(
  'flex items-center justify-items-center z-1 w-6 h-6 rounded-full bg-grey7',
);
const flexCenteredClass = apply(`flex items-center justify-items-center`);

/**
 * renders the full screen image modal that is triggered on image click
 */
const ImageOverlay: React.FC<IImageOverlay> = props => {
  const { src } = props;

  const closeModal = React.useRef(props.closeModal);

  React.useEffect(() => {
    const close = ev => {
      if (ev.key === 'Escape') {
        closeModal.current();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  const transformRef = React.useRef(null);

  const handleZoomIn = () => {
    if (transformRef) {
      transformRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    transformRef.current.zoomOut();
  };

  return (
    <Portal>
      <ModalContainer style={{ zIndex: 103 }}>
        <div
          className={tx(`${flexCenteredClass} w-screen h-screen bg-grey3`)}
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
            <div className={tx(`${closeDivClass}`)} onClick={closeModal.current}>
              <Icon type="XMarkIcon" />
            </div>
          </div>

          {src && (
            <TransformWrapper ref={transformRef} centerOnInit={true} centerZoomedOut={true}>
              <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
                <picture className={tw('flex')}>
                  <source srcSet={src.url} />
                  <img src={src.fallbackUrl} alt="" />
                </picture>
              </TransformComponent>
            </TransformWrapper>
          )}
        </div>
      </ModalContainer>
    </Portal>
  );
};

export default ImageOverlay;
