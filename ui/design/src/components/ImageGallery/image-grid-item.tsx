import * as React from 'react';
import styled, { css } from 'styled-components';
import { StyledCloseDiv } from '../Editor/styled-editor-box';
import Icon from '../Icon';
import { DelayLoad } from '../../utils/delay-load';
import { isMobile } from 'react-device-detect';

export const StyledPicture = styled.picture`
  display: flex;
`;

export const FlexDiv = styled.div`
  display: flex;
`;

export const StyledImg = styled.img<{ singleImage?: boolean; isMobile?: boolean }>`
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

export const StyledImgContainer = styled.div`
  display: flex;
  position: relative;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
`;

export interface ImageObject {
  originalSrc?: string;
  src: { url?: string; fallbackUrl?: string };
  size: { width: number; height: number; naturalWidth: number; naturalHeight: number };
  id: string;
}

export interface IGridItemProps {
  image: ImageObject;
  images: ImageObject[];
  handleClickImage: (image: ImageObject) => void;
  handleDeleteImage: (image: ImageObject) => void;
  editorStyle?: boolean;
}

export const ImageGridItem: React.FC<IGridItemProps> = props => {
  const { image, images, handleClickImage, handleDeleteImage, editorStyle } = props;

  const imageSrc = React.useMemo(() => image, [image]);

  const [imgLoaded, setImgLoaded] = React.useState(false);

  const getGridSpan = () => {
    if (editorStyle) {
      switch (images.length) {
        case 1:
          return 6;
        case 2:
          return 3;
        case 4:
          return 3;
        default:
          return 2;
      }
    } else {
      switch (images.length) {
        case 1:
          return 6;
        case 3:
          return 2;

        default:
          return 3;
      }
    }
  };

  const style = {
    gridColumnEnd: `span ${getGridSpan()}`,
    gridRowEnd: `span ${getGridSpan()}`,
  };

  return (
    <StyledImgContainer
      role="img"
      style={style}
      onClick={ev => {
        if (handleClickImage && typeof handleClickImage === 'function' && imgLoaded) {
          handleClickImage(imageSrc);
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
              handleDeleteImage(imageSrc);
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
      <StyledPicture>
        <source srcSet={imageSrc.originalSrc} />
        <source srcSet={imageSrc.src.url} />
        <StyledImg
          src={imageSrc.src.fallbackUrl}
          singleImage={images.length === 1}
          onLoad={() => setImgLoaded(true)}
          hidden={!imgLoaded}
          isMobile={isMobile && editorStyle}
        />
      </StyledPicture>
      {!imgLoaded && (
        <DelayLoad>
          <FlexDiv>
            <StyledImg
              src={'/images/image-placeholder.webp'}
              singleImage={images.length === 1}
              height={images.length === 1 ? image.size.height : ''}
            />
          </FlexDiv>
        </DelayLoad>
      )}
    </StyledImgContainer>
  );
};
