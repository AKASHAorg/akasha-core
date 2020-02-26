import * as React from 'react';
import StyledButton from './styled-button';

export interface IButtonProps {
  className?: string;
  label: string;
  onClick?: any;
  primary?: boolean;
  secondary?: boolean;
}

const Button = (props: IButtonProps) => {
  return <StyledButton className={props.className} {...props} />;
};

export default Button;
