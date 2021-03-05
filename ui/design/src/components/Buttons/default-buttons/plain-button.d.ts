import * as React from 'react';
export interface IPlainButtonProps {
  className?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  label: string | number;
  children: React.ReactNode;
  color?: string;
  disabled?: boolean;
}
declare const PlainButton: React.ForwardRefExoticComponent<
  IPlainButtonProps & React.RefAttributes<HTMLDivElement>
>;
export default PlainButton;
