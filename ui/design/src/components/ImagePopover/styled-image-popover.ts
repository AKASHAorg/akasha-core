import { Button, Box, Drop, Tab, Text } from 'grommet';
import styled, { css } from 'styled-components';

const StyledDrop = styled(Drop)`
  margin-top: 0.313rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.shapes.largeBorderRadius};
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

const StyledUploadValueBox = styled(Box)`
  width: 21.875rem;
`;

const StyledInputDiv = styled.div`
  height: 8.125rem;
  width: 19.875rem;
  background-color: ${props => props.theme.colors.ultraLightBackground};
  border: 1px dashed ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.shapes.borderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const StyledUploadingDiv = styled.div`
  height: 8.125rem;
  width: 19.875rem;
  background-color: ${props => props.theme.colors.ultraLightBackground};
  border: 1px solid ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.shapes.borderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledText = styled(Text)`
  padding: 0 3.125rem;
  text-align: center;
`;

const StyledValueText = styled(Text)`
  max-width: 11rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledButton = styled(Button)`
  border-radius: ${props => props.theme.shapes.borderRadius};
  color: ${props => props.theme.colors.white};
`;

const StyledImageInput = styled.input`
  display: none;
`;

const StyledImg = styled.img`
  height: 3rem;
  width: 3rem;
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
`;

const StyledTab = styled(Tab)`
  ${props => css`
    flex-grow: 1;
    height: 2.7rem;
    & > div {
      margin: 0;
      border-bottom: 1px solid ${props.theme.colors.border};
      text-align: center;
      padding: 0.75rem 0;
    }

    &[aria-selected='true'] {
      > div {
        border-bottom-color: ${props.theme.colors.accent};

        > div {
          color: ${props.theme.colors.accent};

          > svg {
            stroke: ${props.theme.colors.accent};
          }
        }
      }
    }
  `}
`;

export {
  StyledButton,
  StyledDrop,
  StyledImageInput,
  StyledImg,
  StyledImageDiv,
  StyledInputDiv,
  StyledUploadingDiv,
  StyledUploadValueBox,
  StyledTab,
  StyledText,
  StyledValueText,
};
