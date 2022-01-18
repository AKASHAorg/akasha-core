import { ButtonProps } from 'grommet';
import * as React from 'react';
import { StyledButton } from './styled-duplex-button';

export interface IDuplexButtonProps extends ButtonProps {
  onClickInactive?: React.EventHandler<React.SyntheticEvent>;
  onClickActive?: React.EventHandler<React.SyntheticEvent>;
  inactiveLabel?: string;
  activeLabel?: string;
  activeHoverLabel?: string;
  active: boolean;
  // external css
  className?: string;
  allowMinimization?: boolean;
  style?: React.CSSProperties;
}

const DuplexButton = (props: IDuplexButtonProps) => {
  const {
    onClickActive,
    onClickInactive,
    inactiveLabel,
    activeLabel,
    activeHoverLabel,
    active,
    className,
    style,
    icon,
    allowMinimization,
  } = props;

  const [hovered, setHovered] = React.useState(false);

  return (
    <StyledButton
      data-testid="duplex-button"
      active={active}
      className={className}
      style={style}
      label={active ? (hovered ? activeHoverLabel : activeLabel) : inactiveLabel}
      onClick={active ? onClickActive : onClickInactive}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      icon={icon}
      allowMinimization={allowMinimization}
    />
  );
};

DuplexButton.defaultProps = {
  inactiveLabel: 'Follow',
  activeLabel: 'Following',
  activeHoverLabel: 'Unfollow',
  active: false,
};

export default DuplexButton;
