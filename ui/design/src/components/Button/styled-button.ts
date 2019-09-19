import { SyntheticEvent } from 'react';
import styled, { css } from 'styled-components';
import MarginInterface from '../../interfaces/margin.interface';
import MarginSetter from '../../utils/marginSetter';

export type ButtonType = 'regular' | 'alert' | 'primary';

interface ButtonProps {
  buttonType: ButtonType;
  ghost?: boolean;
  disabled?: boolean;
  small?: boolean;
  fullWidth?: boolean;
  onClick: (ev: SyntheticEvent) => void;
  margin?: MarginInterface;
  backgroundColor?: string;
}

const StyledButton = styled.button<ButtonProps>`
  ${props => {
    const {
      theme: { colors },
      buttonType,
      ghost,
      disabled,
      fullWidth,
      margin,
      backgroundColor,
    } = props;

    let borderColor = colors.grey;
    let hoverColor = colors.darkGrey;
    switch (buttonType) {
      case 'alert':
        borderColor = colors.red;
        hoverColor = colors.darkRed;
        break;
      case 'primary':
        borderColor = colors.blue;
        hoverColor = colors.darkBlue;
        break;
      default:
    }

    // change margins to ones passed in props
    let marginSize = '0px';
    if (margin) {
      marginSize = MarginSetter(margin);
    }

    // change background color to the one passed in props
    if (backgroundColor) { borderColor = backgroundColor; }

    return css`
      background-color: ${ghost ? 'transparent' : borderColor};
      border-color: ${borderColor};
      color: ${ghost ? borderColor : colors.white};
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
      margin: ${marginSize};
      ${disabled
        ? `opacity: ${colors.disabledOpacity}`
        : css`
            &:hover {
              background-color: ${ghost ? 'transparent' : hoverColor};
              border-color: ${hoverColor};
              color: ${ghost ? hoverColor : colors.white};
            }
          `}

      ${fullWidth
        ? css`
            width: 100%;
          `
        : ''}
    `;
  }};

  align-items: center;

  border-radius: ${props => props.theme.shapes.borderRadius};
  border-style: solid;
  border-width: ${props => props.theme.spacing.components.button.borderWidth};

  display: inline-flex;
  font-size: ${props =>
    props.small
      ? props.theme.spacing.components.button.fontSize.small
      : props.theme.spacing.components.button.fontSize.normal};
  font-family: ${props => props.theme.shapes.fontFamily};
  font-weight: ${props => props.theme.shapes.fontWeight.regular};
  justify-content: center;

  padding: ${props =>
    props.small
      ? props.theme.spacing.components.button.padding.small
      : props.theme.spacing.components.button.padding.normal};

  user-select: none;
`;

StyledButton.defaultProps = {
  ghost: false,
  disabled: false,
  small: false,
  fullWidth: false,
};

export default StyledButton;
