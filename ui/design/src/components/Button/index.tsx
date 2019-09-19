import * as React from 'react';
import MarginInterface from '../../interfaces/margin.interface';
import StyledButton, { ButtonType } from './styled-button';

export interface IButtonProps {
  buttonType?: ButtonType;
  ghost?: boolean;
  disabled?: boolean;
  small?: boolean;
  fullWidth?: boolean;
  onClick: React.EventHandler<React.SyntheticEvent>;
  margin?: MarginInterface;
  backgroundColor?: string;
  children: React.ReactNode;
}

const noop = () => {};

const Button: React.FC<IButtonProps> = props => {
  const { buttonType, ghost, disabled, small, fullWidth, onClick, margin, backgroundColor } = props;

  return (
    <StyledButton
      buttonType={buttonType!}
      ghost={ghost}
      disabled={disabled}
      small={small}
      fullWidth={fullWidth}
      onClick={disabled ? noop : onClick}
      margin={margin}
      backgroundColor={backgroundColor}
    >
      {props.children}
    </StyledButton>
  );
};

const defaultProps = {
  buttonType: 'regular' as ButtonType,
  ghost: false,
  disabled: false,
  small: false,
  fullWidth: false,
};

StyledButton.defaultProps = defaultProps;

export default Button;
