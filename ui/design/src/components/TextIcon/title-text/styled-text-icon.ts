import styled, { css } from 'styled-components';
import MarginSetter from '../../../utils/marginSetter';
import { IStyledTextProps, ITextIconProps } from './text-icon';
import { Text } from 'grommet';

const StyledTextIcon = styled.div<ITextIconProps>`
  ${props => {
    const {
      theme: { colors },
      color,
      margin,
      backgroundColor,
      spacing,
      clickable,
      menuActive,
      menuIcon,
    } = props;

    // change margins to ones passed in props
    let marginSize = 'margin: 0px;';
    if (margin) {
      marginSize = MarginSetter(margin);
    }

    return css`
      & > *:first-child {
        margin-right: ${spacing ? spacing : '0.625em'};
      }
      background-color: ${backgroundColor ? backgroundColor : ''};
      color: ${color ? color : colors.dark};
      ${
        menuIcon
          ? `padding-left: ${props.theme.shapes.baseSpacing * 8 + 2}px
          color: ${props.theme.colors.accent};
          & * {
            stroke: ${props.theme.colors.accent};
            }`
          : ''
      }
      ${
        menuActive
          ? `padding-left: ${props.theme.shapes.baseSpacing * 8}px
          border-left: 2px solid ${props.theme.colors.accent};
          color: ${props.theme.colors.accent};
          & * {
            stroke: ${props.theme.colors.accent};
            }`
          : ''
      }
      ${marginSize}
      
      &:hover {
        ${
          clickable
            ? `cursor: pointer;
          color: ${props.theme.colors.accent};
          & * {
            stroke: ${props.theme.colors.accent};
            }`
            : ''
        }
      }
    `;
  }};
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const StyledText = styled(Text)<IStyledTextProps>`
  ${props => {
    if (props.accentColor) {
      return css`
        color: ${props.theme.colors.accent};
      `;
    }
    return;
  }}
`;

export { StyledTextIcon, StyledText };
