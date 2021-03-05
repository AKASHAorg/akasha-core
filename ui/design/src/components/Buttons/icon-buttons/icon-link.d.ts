import { AnchorProps } from 'grommet';
import * as React from 'react';
export interface ILinkIconButtonProps extends AnchorProps {
  className?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  iconPosition?: 'start' | 'end';
  icon?: React.ReactElement;
  label?: string | number;
  active?: boolean;
  padded?: boolean;
  primaryColor?: boolean;
  bold?: boolean;
}
declare const LinkIconButton: React.ForwardRefExoticComponent<
  ILinkIconButtonProps & React.RefAttributes<unknown>
>;
export default LinkIconButton;
