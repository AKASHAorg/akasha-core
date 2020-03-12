import { Button, Drop, Tab, Text } from 'grommet';
import styled, { css } from 'styled-components';

const StyledDrop = styled(Drop)`
  height: 13.75rem;
  width: 21.875rem;
  margin-top: 0.313rem;
  border: 1px solid ${props => props.theme.colors.border}
  border-radius: ${props => props.theme.shapes.largeBorderRadius};
`;

const StyledInputDiv = styled.div`
  height: 8.125rem;
  width: 19.875rem;
  background-color: ${props => props.theme.colors.lightBackground};
  border: 1px dashed ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.shapes.borderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const StyledText = styled(Text)`
  padding: 0 3.125rem;
  text-align: center;
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
`;

const StyledTab = styled(Tab)`
  ${props => css`
    flex-grow: 1;

    & > div {
      margin: 0;
      border-bottom: 1px solid ${props.theme.colors.border};
      text-align: center;
      padding: 0.75rem 0;

      > span {
        font-family: ${props.theme.shapes.fontFamily};
        font-size: ${props.theme.shapes.fontSizes.medium.size};
        line-height: ${props.theme.shapes.fontSizes.medium.height};
        color: ${props.theme.colors.primaryText};
      }
    }

    :hover {
      > div {
        border-bottom-color: ${props.theme.colors.border};

        > span {
          color: ${props.theme.colors.primaryText};
        }
      }
    }

    &[aria-selected='true'] {
      > div {
        border-bottom-color: ${props.theme.colors.accent};

        > div {
          color: ${props.theme.colors.accent};
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
  StyledInputDiv,
  StyledTab,
  StyledText,
};
