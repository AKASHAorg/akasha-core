import styled, { css } from 'styled-components';
import MarginInterface from '../../interfaces/margin.interface';
import MarginSetter from '../../utils/marginSetter';

interface InputProps {
  disabled?: boolean;
  focused?: boolean;
  withButton?: boolean;
  margin?: MarginInterface;
  backgroundColor?: string;
}

const StyledInput = styled.label<InputProps>`
  ${props => {
    const { margin, backgroundColor } = props;

    let marginSize = '0px';
    if (margin) {
      marginSize = MarginSetter(margin);
    }

    return css`
      align-content: space-around;
      background: ${props => backgroundColor || props.theme.colors.white};
      border: ${props => props.theme.spacing.components.input.borderSize} solid
        ${props => props.theme.colors.lightGrey};
      border-radius: ${props => props.theme.shapes.borderRadius};
      display: flex;
      flex-direction: row;
      font-family: ${props => props.theme.shapes.fontFamily};
      font-size: ${props => props.theme.spacing.components.input.fontSize};
      font-weight: ${props => props.theme.shapes.fontWeight.regular};
      justify-content: space-around;
      width: 100%;
      ${marginSize}
    `;
  }}

  ${props => {
    if (props.withButton) {
      return css`
        border: none;
      `;
    }
  }}

  ${props => {
    if (props.disabled) {
      return css`
        background: ${props.theme.colors.background};
      `;
    }
  }}

  ${props => {
    if (props.focused) {
      return css`
        border-color: ${props => props.theme.colors.grey};
      `;
    }
  }}

  ${props => {
    if (props.withButton) {
      return css`
        & > *:first-of-type,
        & > *:first-of-type > input {
          border-radius: ${props => props.theme.shapes.borderRadius} 0 0
            ${props => props.theme.shapes.borderRadius};
          border-right-width: 0;
        }

        & > *:last-child,
        & > *:last-child > input {
          border-radius: 0 ${props => props.theme.shapes.borderRadius}
            ${props => props.theme.shapes.borderRadius} 0;
          border-left-width: 0;
        }
      `;
    }
  }}
`;

StyledInput.defaultProps = {
  disabled: false,
  focused: false,
  withButton: false,
};

const StyledIconContainer = styled.div`
  align-items: center;
  color: ${props => props.theme.colors.grey};
  display: flex;
  justify-content: center;
  padding: ${props => props.theme.spacing.components.button.padding.normal};
`;

export { StyledInput, StyledIconContainer };
