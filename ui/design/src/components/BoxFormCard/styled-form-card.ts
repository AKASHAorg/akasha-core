import { Image, Text } from 'grommet';
import styled, { css } from 'styled-components';

const StyledText = styled(Text)`
  text-transform: uppercase;
  margin-left: 0.5em;
`;

export interface IStyledTextInput {
  computedWidth: string;
}

const StyledTextInput = styled.input<IStyledTextInput>`
  outline: none;
  background: transparent;
  border: none;
  box-sizing: content-box;
  ${props => css`
    width: ${props.computedWidth};
    font-family: ${props.theme.shapes.fontFamily};
    font-size: ${props.theme.shapes.fontSizes.large.size};
    line-height: ${props.theme.shapes.fontSizes.large.height};
    color: ${props.theme.colors.primaryText};
  `}
`;

const HiddenSpan = styled.span`
  ${props => css`
    font-family: ${props.theme.shapes.fontFamily};
    font-size: ${props.theme.shapes.fontSizes.large.size};
    line-height: ${props.theme.shapes.fontSizes.large.height};
  `}
  margin: 0;
  padding: 0;
  position: absolute;
  height: 0;
  overflow: hidden;
  white-space: pre;
`;

const StyledImage = styled(Image)``;

const BaseDiv = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 0;
`;

const BasePlaceholderDiv = styled(BaseDiv)<{ active?: boolean }>`
  ${props => {
    if (props.active) {
      return css`
        border: 1px dashed ${props.theme.colors.accent};
        svg {
          & * {
            stroke: ${props.theme.colors.accent};
          }
        }
      `;
    }
    return css`
      border: 1px dashed ${props.theme.colors.mediumGrey};
    `;
  }}
`;

const BaseImageDiv = styled(BaseDiv)<{ active?: boolean }>`
  ${props => {
    if (props.active) {
      return css`
        opacity: 0.4;
      `;
    }
    return;
  }}
`;

const StyledAvatarDiv = styled(BaseImageDiv)`
  position: relative;
  overflow: hidden;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
`;

const StyledCoverImageDiv = styled(BaseImageDiv)`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 9rem;
  border-radius: ${props => props.theme.shapes.borderRadius};
`;

const StyledAvatarPlaceholderDiv = styled(BasePlaceholderDiv)`
  background-color: ${props => props.theme.colors.ultraLightGrey};
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  margin: 0;
`;
const StyledCoverImagePlaceholderDiv = styled(BasePlaceholderDiv)`
  background-color: ${props => props.theme.colors.ultraLightGrey};
  width: 100%;
  height: 9rem;
  border-radius: ${props => props.theme.shapes.borderRadius};
`;

const StyledAvatarOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(19, 37, 64, 0.64);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

const StyledCoverImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(19, 37, 64, 0.64);
  border-radius: ${props => props.theme.shapes.borderRadius};
`;

export {
  StyledText,
  StyledAvatarPlaceholderDiv,
  StyledCoverImagePlaceholderDiv,
  StyledAvatarDiv,
  StyledCoverImageDiv,
  StyledAvatarOverlay,
  StyledCoverImageOverlay,
  StyledImage,
  StyledTextInput,
  HiddenSpan,
};
