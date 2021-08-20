import * as React from 'react';
import { ModalContainer } from '../SignInModal/fullscreen-modal-container';
import { Portal } from '../Editor/helpers';
import Icon from '../Icon';
import { StyledCloseDiv } from '../Editor/styled-editor-box';
import styled from 'styled-components';

export interface IImageOverlay {
  initialImageIndex: number;
  images: string[];
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

/**
 * renders the full screen image modal that is triggered on image click
 */
const ImageOverlay: React.FC<IImageOverlay> = props => {
  const { initialImageIndex, images, closeModal } = props;

  const [currentImageIndex, setCurrentImageIndex] = React.useState(initialImageIndex);

  return (
    <Portal>
      <ModalContainer
        animation={{
          type: 'fadeIn',
          duration: 250,
          delay: 0,
        }}
      >
        <StyledOverlay
          onClick={(ev: React.SyntheticEvent) => {
            /**
             * prevents click bubbling to parent so the user doesn't get redirected
             */
            ev.stopPropagation();
          }}
        >
          <StyledCloseDiv onClick={closeModal}>
            <Icon type="close" clickable={true} />
          </StyledCloseDiv>
          {images?.length && (
            <picture>
              <img src={images[currentImageIndex]} />
            </picture>
          )}
        </StyledOverlay>
      </ModalContainer>
    </Portal>
  );
};

export default ImageOverlay;
