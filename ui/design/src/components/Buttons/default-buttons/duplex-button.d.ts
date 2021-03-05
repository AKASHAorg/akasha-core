import { ButtonProps } from 'grommet';
import * as React from 'react';
export interface IDuplexButtonProps extends ButtonProps {
  onClickInactive?: React.EventHandler<React.SyntheticEvent>;
  onClickActive?: React.EventHandler<React.SyntheticEvent>;
  inactiveLabel?: string;
  activeLabel?: string;
  activeHoverLabel?: string;
  active: boolean;
  className?: string;
  style?: React.CSSProperties;
}
declare const DuplexButton: {
  (props: IDuplexButtonProps): JSX.Element;
  defaultProps: {
    inactiveLabel: string;
    activeLabel: string;
    activeHoverLabel: string;
    active: boolean;
  };
};
export { DuplexButton };
