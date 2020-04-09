import { Text, Tab, TabProps } from 'grommet';
import styled, { css } from 'styled-components';
import { Button } from '../../Buttons';

const StyledButton = styled(Button)`
  width: 50%;
`;

const StyledText = styled(Text)`
  text-transform: uppercase;
`;

const StyledTab = styled(Tab)<TabProps>`
  ${props => css`
    flex-grow: 1;

    & > div {
      margin: 0;
      border-bottom: 1px solid ${props.theme.colors.lightGrey};
      text-align: center;
      padding: 0.75em 0;

      > span {
        font-family: ${props.theme.shapes.fontFamily};
        font-size: ${props.theme.shapes.fontSizes.medium.size};
        line-height: ${props.theme.shapes.fontSizes.medium.height};
        color: ${props.theme.colors.grey};
      }
    }

    :hover {
      > div {
        border-bottom-color: ${props.theme.colors.lightGrey};

        > span {
          color: ${props.theme.colors.grey};
        }
      }
    }

    &[aria-selected='true'] {
      > div {
        border-bottom-color: ${props.theme.colors.accent};

        > span {
          color: ${props.theme.colors.accent};
        }
      }
    }
  `}
`;

export { StyledText, StyledButton, StyledTab };
