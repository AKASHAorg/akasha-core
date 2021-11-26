import * as React from 'react';
import { ModalContainer } from '../SignInModal/fullscreen-modal-container';
import { Box } from 'grommet';
import { Portal } from '../Editor/helpers';
import Icon from '../Icon';
import styled from 'styled-components';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ImageObject } from '../Editor/image-gallery';

export interface IImageOverlay {
  clickedImg: ImageObject;
  images: ImageObject[];
  closeModal: () => void;
}

const StyledOverlay = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.darkGrey};
`;

const StyledBox = styled(Box)`
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1;
`;

const StyledCloseDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.grey};
`;

const StyledScrollLeft = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  z-index: 1;
`;

const StyledScrollRight = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  z-index: 1;
`;

/**
 * renders the full screen image modal that is triggered on image click
 */
const MultipleImageOverlay: React.FC<IImageOverlay> = props => {
  const { clickedImg, images, closeModal } = props;

  const [currentImg, setCurrentImg] = React.useState(clickedImg);

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

  const handlePrevImg = () => {
    const currImgIndex = images.indexOf(currentImg);
    const prevIndex = currImgIndex > 0 ? images[currImgIndex - 1] : images[images.length - 1];
    setCurrentImg(prevIndex);
  };

  const handleNextImg = () => {
    const currImgIndex = images.indexOf(currentImg);
    const nextIndex = currImgIndex < images.length - 1 ? images[currImgIndex + 1] : images[0];
    setCurrentImg(nextIndex);
  };

  return (
    <Portal>
      <ModalContainer
        animation={{
          type: 'fadeIn',
          duration: 250,
          delay: 0,
        }}
        style={{ zIndex: 101 }}
      >
        <StyledOverlay
          onClick={(ev: React.SyntheticEvent) => {
            /**
             * prevents click bubbling to parent so the user doesn't get redirected
             */
            ev.stopPropagation();
          }}
        >
          <StyledBox direction="row" gap="xsmall" pad="small">
            <StyledCloseDiv onClick={handleZoomIn}>
              <Icon type="zoomIn" clickable={true} />
            </StyledCloseDiv>
            <StyledCloseDiv onClick={handleZoomOut}>
              <Icon type="zoomOut" clickable={true} />
            </StyledCloseDiv>
            <StyledCloseDiv onClick={closeModal}>
              <Icon type="close" clickable={true} />
            </StyledCloseDiv>
          </StyledBox>
          {images.length > 1 && (
            <StyledScrollLeft>
              <StyledCloseDiv onClick={handlePrevImg}>
                <Icon type="arrowUp" clickable={true} style={{ transform: 'rotate(270deg)' }} />
              </StyledCloseDiv>
            </StyledScrollLeft>
          )}
          {images.length > 1 && (
            <StyledScrollRight>
              <StyledCloseDiv onClick={handleNextImg}>
                <Icon type="arrowUp" clickable={true} style={{ transform: 'rotate(90deg)' }} />
              </StyledCloseDiv>
            </StyledScrollRight>
          )}

          {currentImg && (
            <TransformWrapper ref={transformRef} centerOnInit={true} centerZoomedOut={true}>
              <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
                <picture>
                  <img src={currentImg.src} />
                </picture>
              </TransformComponent>
            </TransformWrapper>
          )}
        </StyledOverlay>
      </ModalContainer>
    </Portal>
  );
};

export default MultipleImageOverlay;
