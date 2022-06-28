import * as React from 'react';
import { StyledCloseDiv } from './styled-editor-box';
import styled, { css } from 'styled-components';
import Icon from '../Icon';
import { isMobile } from 'react-device-detect';

const StyledPicture = styled.picture`
  display: flex;
`;

const StyledImg = styled.img<{ singleImage?: boolean; isMobile?: boolean }>`
  ${props => {
    if (props.isMobile) {
      return css`
        height: 10rem;
        padding-right: 0.3rem;
        aspect-ratio: 1;
      `;
    }
    if (props.singleImage) {
      return css`
        max-width: 100%;
      `;
    }
    return css`
      width: 100%;
      aspect-ratio: 1;
    `;
  }}
  object-fit: cover;
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
`;

const StyledImgContainer = styled.div`
  display: flex;
  position: relative;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
`;

const ScrollableContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow: auto;
  white-space: nowrap;
  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 0.3rem;
`;

const SingleImageContainer = styled.div`
  display: flex;
`;

export interface ImageObject {
  originalSrc?: string;
  src: { url?: string; fallbackUrl?: string };
  size: { width: number; height: number; naturalWidth: number; naturalHeight: number };
  id: string;
}

export interface IImageGallery {
  images: ImageObject[];
  handleDeleteImage?: (image: ImageObject) => void;
  handleClickImage?: (image: ImageObject) => void;
}

const ImageGallery: React.FC<IImageGallery> = props => {
  const { images, handleDeleteImage, handleClickImage } = props;

  const ImageGridItem = ({ image }) => {
    const style = {
      gridColumnEnd: `span ${getGridSpan()}`,
      gridRowEnd: `span ${getGridSpan()}`,
    };

    return (
      <StyledImgContainer
        role="img"
        style={style}
        onClick={ev => {
          if (handleClickImage && typeof handleClickImage === 'function') {
            handleClickImage(image);
          }
          ev.stopPropagation();
          ev.preventDefault();
          return false;
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
            <Icon type="trash" color="white" clickable={true} />
          </StyledCloseDiv>
        )}
        {/* when we have a single image we need to keep the original aspect ratio,
        otherwise give images a 1:1 ratio */}
        <StyledPicture>
          <source srcSet={image.originalSrc} />
          <source srcSet={image.src.url} />
          <StyledImg
            src={image.src.fallbackUrl}
            singleImage={images.length === 1}
            isMobile={isMobile}
          />
        </StyledPicture>
      </StyledImgContainer>
    );
  };

  const getGridSpan = () => {
    if (images.length === 1) {
      return 6;
    }
    if (images.length === 2) {
      return 3;
    }
    if (images.length === 4) {
      return 3;
    }
    return 2;
  };

  if (isMobile) {
    return (
      <ScrollableContainer>
        {images.map((image, index) => (
          <ImageGridItem image={image} key={index} />
        ))}
      </ScrollableContainer>
    );
  }
  if (images.length === 1) {
    return (
      <SingleImageContainer>
        {images.map((image, index) => (
          <ImageGridItem image={image} key={index} />
        ))}
      </SingleImageContainer>
    );
  }
  return (
    <StyledGrid>
      {images.map((image, index) => (
        <ImageGridItem image={image} key={index} />
      ))}
    </StyledGrid>
  );
};

export { ImageGallery };
