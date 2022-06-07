import * as React from 'react';
import { ModalContainer } from '../SignInModal/fullscreen-modal-container';
import { Box } from 'grommet';
import { Portal } from '../Editor/helpers';
import Icon from '../Icon';
import styled from 'styled-components';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export interface IImageOverlay {
  src: { url?: string; fallbackUrl?: string };
  closeModal: () => void;
}

const StyledPicture = styled.picture`
  display: flex;
`;

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
      <ModalContainer
        animation={{
          type: 'fadeIn',
          duration: 250,
          delay: 0,
        }}
        style={{ zIndex: 103 }}
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
            <StyledCloseDiv onClick={closeModal.current}>
              <Icon type="close" testId="close-icon" clickable={true} />
            </StyledCloseDiv>
          </StyledBox>

          {src && (
            <TransformWrapper ref={transformRef} centerOnInit={true} centerZoomedOut={true}>
              <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
                <StyledPicture>
                  <source srcSet={src.url} />
                  <img src={src.fallbackUrl} alt="" />
                </StyledPicture>
              </TransformComponent>
            </TransformWrapper>
          )}
        </StyledOverlay>
      </ModalContainer>
    </Portal>
  );
};

export default ImageOverlay;
