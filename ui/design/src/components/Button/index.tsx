import { ButtonProps } from 'grommet';
import * as React from 'react';
import StyledButton from './styled-button';

export interface IButtonProps extends ButtonProps {
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  background?: string;
  primary?: boolean;
  secondary?: boolean;
  height?: number;
  slimBorder?: boolean;
  accentBorder?: boolean;
  style?: React.CSSProperties;
}

const Button = (props: IButtonProps) => {
  const { className, ...other } = props;
  return <StyledButton className={className} {...other} />;
};

export default Button;
