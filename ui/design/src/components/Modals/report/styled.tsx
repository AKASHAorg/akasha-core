import styled, { css } from 'styled-components';
import { Box, Text } from 'grommet';

export const StyledBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
`;

export const StyledText = styled(Text)`
  text-transform: uppercase;
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  resize: none;
  outline: none;
  background: transparent;
  border: none;
  box-sizing: content-box;
  border-bottom: ${props => `0.5px solid ${props.theme.colors.secondaryText}`};
  ${props => css`
    font-family: ${props.theme.shapes.fontFamily};
    font-size: ${props.theme.shapes.fontSizes.large.size};
    line-height: ${props.theme.shapes.fontSizes.large.height};
    color: ${props.theme.colors.primaryText};
  `}
  &::placeholder {
    font-family: ${props => props.theme.shapes.fontFamily};
    color: ${props => props.theme.colors.secondaryText};
  }
`;

export const HiddenSpan = styled.span`
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
