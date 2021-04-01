import { Box, Text } from 'grommet';
import { Editable } from 'slate-react';
import styled, { css } from 'styled-components';

const StyledDiv = styled.div`
  padding-right: ${props => `${props.theme.shapes.baseSpacing}px`};
  color: ${props => props.theme.colors.accent};
  opacity: 0.4;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

const StyledIconDiv = styled.div`
  display: flex;
  align-items: center;
`;

const StyledMeterDiv = styled.div`
  margin-top: 1.25rem;
  transform: translateX(0.625rem);
`;

const StyledBox = styled(Box)<{ isMobile?: boolean }>`
  ${props => {
    if (props.isMobile) {
      return css`
        height: 100vh;
        &:focus-within {
          height: 45vh;
        }
      `;
    }
    return css`
      max-height: 38rem;
    `;
  }}
`;

const StyledImageInput = styled.input`
  display: none;
`;

const StyledImageDiv = styled.div`
  height: 3rem;
  width: 3rem;
  background-color: ${props => props.theme.colors.ultraLightBackground};
  border: 1px solid ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.shapes.borderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledUploadingDiv = styled.div<{ width?: number; height?: number }>`
  position: relative;
  height: ${props => (props.height ? `${props.height}px` : '8.125rem')};
  width: ${props => (props.width ? `${props.width}px` : '100%')};
  background-color: ${props => props.theme.colors.ultraLightBackground};
  border: 1px solid ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.shapes.borderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledValueText = styled(Text)`
  max-width: 11rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledText = styled(Text)`
  padding: 0 3.125rem;
  text-align: center;
`;

const StyledCloseDiv = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.grey};
`;

const StyledEditable = styled(Editable)`
  ::selection {
    background-color: ${props => props.theme.colors.accent};
  }
`;

export {
  StyledBox,
  StyledDiv,
  StyledEditable,
  StyledIconDiv,
  StyledMeterDiv,
  StyledImageInput,
  StyledUploadingDiv,
  StyledImageDiv,
  StyledValueText,
  StyledText,
  StyledCloseDiv,
};
