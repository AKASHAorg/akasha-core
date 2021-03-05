import { ButtonProps } from 'grommet';
export interface IButtonProps extends ButtonProps {
  className?: string;
  onClick?: any;
  primary?: boolean;
  secondary?: boolean;
}
declare const Button: (props: IButtonProps) => JSX.Element;
export default Button;
