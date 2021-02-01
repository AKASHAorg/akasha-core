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
      ${menuIcon
        ? `padding-left: ${props.theme.shapes.baseSpacing * 8 + 2}px
          color: ${props.theme.colors.accent};
          & * {
            stroke: ${props.theme.colors.accent};
            }`
        : ''}
      ${menuActive
        ? `padding-left: ${props.theme.shapes.baseSpacing * 8}px
          border-left: 2px solid ${props.theme.colors.accent};
          color: ${props.theme.colors.accent};
          & * {
            stroke: ${props.theme.colors.accent};
            }`
        : ''}
      ${marginSize}

      &:hover {
        ${clickable
          ? `cursor: pointer;
          color: ${props.theme.colors.accent};
          & * {
            stroke: ${props.theme.colors.accent};
            }`
          : ''}
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

export interface IconSize {
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// background div for icons, will scale with icon size, adding 0.75 rem to each icon size
const StyledIconDiv = styled.div<IconSize>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => {
    if (props.size) {
      switch (props.size) {
        case 'xxs':
          return css`
            width: 1.5rem;
            height: 1.5rem;
          `;
        case 'xs':
          return css`
            width: 1.75rem;
            height: 1.75rem;
          `;
        case 'sm':
          return css`
            width: 2.25rem;
            height: 2.25rem;
          `;
        case 'md':
          return css`
            width: 2.75rem;
            height: 2.75rem;
          `;
        case 'lg':
          return css`
            width: 3.25rem;
            height: 3.25rem;
          `;
        case 'xl':
          return css`
            width: 3.75rem;
            height: 3.75rem;
          `;
        default:
          return css`
            width: 2.25rem;
            height: 2.25rem;
          `;
      }
    }
    return css`
      width: 2.25rem;
      height: 2.25rem;
    `;
  }}
  border-radius: 50%;
  cursor: pointer;
  background-color: ${props => props.theme.colors.lightestGrey};
`;

export { StyledTextIcon, StyledText, StyledIconDiv };
