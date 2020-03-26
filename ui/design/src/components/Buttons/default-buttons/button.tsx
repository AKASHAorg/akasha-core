import { ButtonProps } from 'grommet';
import * as React from 'react';
import StyledButton from './styled-button';

export interface IButtonProps extends ButtonProps {
  className?: string;
  onClick?: any;
  primary?: boolean;
  secondary?: boolean;
}

const Button = (props: IButtonProps) => {
  return <StyledButton className={props.className} {...props} />;
};

export default Button;
