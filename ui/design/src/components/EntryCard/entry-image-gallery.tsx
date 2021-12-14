import * as React from 'react';
import { StyledCloseDiv } from '../Editor/styled-editor-box';
import styled, { css } from 'styled-components';
import Icon from '../Icon';
import { Box, Text } from 'grommet';

const StyledImg = styled.img<{ singleImage?: boolean }>`
  ${props => {
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
  position: relative;
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  border: 1px solid ${props => props.theme.colors.border};
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 0.3rem;
  position: relative;
`;

const StyledPill = styled(Box)`
  position: absolute;
  bottom: 21px;
  right: 16px;
  z-index: 1;
`;

export interface ImageObject {
  src: string;
  size: { width: number; height: number; naturalWidth: number; naturalHeight: number };
  id: string;
}

export interface IImageGallery {
  imagesLabel?: string;
  imageLabel?: string;
  images: ImageObject[];
  handleDeleteImage?: (image: ImageObject) => void;
  handleClickImage?: (image: ImageObject) => void;
}

const EntryImageGallery: React.FC<IImageGallery> = props => {
  const { imagesLabel, imageLabel, images, handleDeleteImage, handleClickImage } = props;

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
            <Icon type="trash" clickable={true} />
          </StyledCloseDiv>
        )}
        {/* when we have a single image we need to keep the original aspect ratio,
        otherwise give images a 1:1 ratio */}
        <StyledImg src={image.src} singleImage={images.length === 1} />
      </StyledImgContainer>
    );
  };

  const MoreImagesPill = () => {
    const hiddenImages = images.length - 4;
    const label = hiddenImages > 1 ? imagesLabel : imageLabel;
    return (
      <StyledPill
        direction="row"
        round="large"
        background={{ color: 'accent' }}
        fill="horizontal"
        width={{ max: '6rem' }}
        height="1.5rem"
        align="center"
        justify="center"
      >
        <Text color="white">{`+${hiddenImages} ${label}`}</Text>
      </StyledPill>
    );
  };

  const getGridSpan = () => {
    if (images.length === 1) {
      return 6;
    }
    if (images.length === 3) {
      return 2;
    }
    return 3;
  };

  // limit shown images to 4
  const displayedImages = images.slice(0, 4);

  return (
    <StyledGrid>
      {displayedImages.map((image, index) => (
        <ImageGridItem image={image} key={index} />
      ))}
      {images.length > 4 && <MoreImagesPill />}
    </StyledGrid>
  );
};

EntryImageGallery.defaultProps = {
  imagesLabel: 'images',
  imageLabel: 'image',
};

export { EntryImageGallery };
