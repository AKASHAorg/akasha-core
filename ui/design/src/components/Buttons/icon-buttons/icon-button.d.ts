import * as React from 'react';
import { ButtonProps } from 'grommet';
export interface IIconButtonProps extends ButtonProps {
  className?: string;
  icon: React.ReactElement;
  label?: string;
  onClick?: () => void;
  primary?: boolean;
  secondary?: boolean;
}
declare const IconButton: (props: IIconButtonProps) => JSX.Element;
export default IconButton;
