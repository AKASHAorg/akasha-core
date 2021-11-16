import * as React from 'react';
import { Box } from 'grommet';
import { StyledCloseDiv } from './styled-editor-box';
import styled from 'styled-components';
import Icon from '../Icon';

const StyledImg = styled.img`
  display: block;
  max-width: 100%;
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
`;

export interface IImageGallery {
  images: any[];
  handleDeleteImage?: any;
  handleClickImage?: any;
}

const ImageGallery: React.FC<IImageGallery> = props => {
  const { images, handleDeleteImage, handleClickImage } = props;
  return (
    <Box>
      {images.map((image, index) => (
        <div
          key={index}
          onClick={ev => {
            if (handleClickImage && typeof handleClickImage === 'function') {
              handleClickImage(image);
            }
            ev.stopPropagation();
            ev.preventDefault();
            return false;
          }}
        >
          <div
            role="img"
            style={{
              minHeight: 30,
              height: 'fit-content',
              width: 'fit-content',
              position: 'relative',
              overflow: 'hidden',
              contain: 'layout',
            }}
          >
            {handleDeleteImage && (
              <StyledCloseDiv
                onClick={ev => {
                  if (handleDeleteImage && typeof handleDeleteImage === 'function') {
                    handleDeleteImage(image);
                  }
                  ev.stopPropagation();
                  ev.preventDefault();
                  return false;
                }}
              >
                <Icon type="close" clickable={true} />
              </StyledCloseDiv>
            )}
            <picture>
              <StyledImg src={image.src} />
            </picture>
          </div>
        </div>
      ))}
    </Box>
  );
};

export { ImageGallery };
