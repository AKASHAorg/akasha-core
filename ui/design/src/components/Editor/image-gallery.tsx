import * as React from 'react';
import { Box } from 'grommet';
import { StyledCloseDiv } from './styled-editor-box';
import styled from 'styled-components';
import Icon from '../Icon';
import { JustifiedInfiniteGrid } from '@egjs/react-infinitegrid';

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

  let n = 1;
  let counter = 0;
  const processedImages = images.map(imageObj => {
    const groupKey = n;
    counter += 1;
    if (counter > 2) {
      counter = 0;
      n += 1;
    }
    return { ...imageObj, groupKey };
  });

  return (
    <Box>
      <JustifiedInfiniteGrid>
        {processedImages.map((image, index) => (
          <div
            style={{
              width: '50px',
            }}
            data-grid-groupkey={image.groupKey}
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
                <StyledImg src={image.src} data-grid-maintained-target="true" />
              </picture>
            </div>
          </div>
        ))}
      </JustifiedInfiniteGrid>
    </Box>
  );
};

export { ImageGallery };
