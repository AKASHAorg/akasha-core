import { Button, Drop, Tab, Text } from 'grommet';
import styled, { css } from 'styled-components';

const StyledDrop = styled(Drop)`
  height: 220px;
  width: 350px;
  margin-top: 5px;
  border-radius: ${props => props.theme.shapes.largeBorderRadius};
`;

const StyledInputDiv = styled.div`
  height: 130px;
  width: 318px;
  background-color: ${props => props.theme.colors.lightBackground};
  border: 1px dashed ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.shapes.borderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const StyledText = styled(Text)`
  padding: 0 50px;
  text-align: center;
`;

const StyledButton = styled(Button)`
  border-radius: ${props => props.theme.shapes.borderRadius};
  color: ${props => props.theme.colors.white};
`;

const StyledTab = styled(Tab)`
  ${props => css`
    flex-grow: 1;

    & > div {
      margin: 0;
      border-bottom: 1px solid ${props.theme.colors.border};
      text-align: center;
      padding: 12px 0;

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

export { StyledButton, StyledDrop, StyledInputDiv, StyledTab, StyledText };
