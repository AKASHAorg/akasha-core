import { ButtonProps } from 'grommet';
import * as React from 'react';
import StyledButton from './styled-button';

export interface IButtonProps extends ButtonProps {
  className?: string;
  onClick?: () => void;
  primary?: boolean;
  secondary?: boolean;
}

const Button = (props: IButtonProps) => {
  const { className, ...other } = props;
  return <StyledButton className={className} {...other} />;
};

export default Button;
