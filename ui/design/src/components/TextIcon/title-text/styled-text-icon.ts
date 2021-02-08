import styled from 'styled-components';
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
      disabled,
    } = props;

    // change margins to ones passed in props
    let marginSize = 'margin: 0px;';
    if (margin) {
      marginSize = MarginSetter(margin);
    }

    return `
      & > *:first-child {
        margin-right: ${spacing ? spacing : '0.625em'};
      }
      background-color: ${backgroundColor ? backgroundColor : ''};
      color: ${color ? color : colors.dark};
      user-select: none;
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
        ${
          disabled &&
          `
          color: ${props.theme.colors.disabled};
          cursor: default;
          * {
            stroke: ${props.theme.colors.disabled}
          }
        `
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
      return `
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
          return `
            width: 1.5rem;
            height: 1.5rem;
          `;
        case 'xs':
          return `
            width: 1.75rem;
            height: 1.75rem;
          `;
        case 'sm':
          return `
            width: 2.25rem;
            height: 2.25rem;
          `;
        case 'md':
          return `
            width: 2.75rem;
            height: 2.75rem;
          `;
        case 'lg':
          return `
            width: 3.25rem;
            height: 3.25rem;
          `;
        case 'xl':
          return `
            width: 3.75rem;
            height: 3.75rem;
          `;
        default:
          return `
            width: 2.25rem;
            height: 2.25rem;
          `;
      }
    }
    return `
      width: 2.25rem;
      height: 2.25rem;
    `;
  }}
  border-radius: 50%;
  cursor: pointer;
  background-color: ${props => props.theme.colors.lightestGrey};
`;

export { StyledTextIcon, StyledText, StyledIconDiv };
