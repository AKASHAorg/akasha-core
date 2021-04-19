import * as React from 'react';
import StyledIconButton from './styled-icon-button';
import { ButtonProps } from 'grommet';
export interface IIconButtonProps extends ButtonProps {
  className?: string;
  icon: React.ReactElement;
  label?: string;
  onClick?: () => void;
  primary?: boolean;
  secondary?: boolean;
}

const IconButton = (props: IIconButtonProps) => {
  return <StyledIconButton className={props.className} {...props} />;
};

export default IconButton;
