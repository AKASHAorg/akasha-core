import { Box, BoxProps, Drop, DropProps, Tab, TabProps, TextInput, TextInputProps } from 'grommet';
import styled, { css } from 'styled-components';

const StyledSearchBox = styled(Box)<BoxProps>`
  > div:nth-child(3) {
    width: auto;
    flex-grow: 1;
  }
`;

const StyledSelectBox = styled(Box)<BoxProps>`
  ${props =>
    `&:hover {
        background-color: ${props.theme.colors.lightBackground};
        cursor: pointer;
      }
    `}
`;

const StyledDrop = styled(Drop)<DropProps>`
  margin-top: 5px;
  border-radius: ${props => props.theme.shapes.largeBorderRadius};
`;

const StyledTextInput = styled(TextInput)<TextInputProps>`
  padding: 0;
  height: 23px;

  ${props => css`
    font-family: ${props.theme.shapes.fontFamily};
    font-size: ${props.theme.shapes.fontSizes.large.size};
    line-height: ${props.theme.shapes.fontSizes.large.height};
    color: ${props.theme.colors.primaryText};
  `}
`;

const StyledResultsLink = styled.a`
  text-decoration: none;

  ${props => css`
    font-family: ${props.theme.shapes.fontFamily};
    font-size: ${props.theme.shapes.fontSizes.medium.size};
    line-height: ${props.theme.shapes.fontSizes.medium.height};
    color: ${props.theme.colors.accent};

    :hover,
    :visited {
      color: ${props.theme.colors.accent};
    }
  `}
`;

const StyledTab = styled(Tab)<TabProps>`
  ${props => css`
    flex-grow: 1;

    & > div {
      margin: 0;
      border-bottom: 1px solid ${props.theme.colors.lightGrey};
      text-align: center;
      padding: 12px 0;

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

export {
  StyledSearchBox,
  StyledSelectBox,
  StyledDrop,
  StyledTextInput,
  StyledResultsLink,
  StyledTab,
};
