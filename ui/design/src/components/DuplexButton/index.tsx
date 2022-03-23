import { ButtonProps } from 'grommet';
import * as React from 'react';
import { StyledButton } from './styled-duplex-button';
import Button from '../Button';
import Icon from '../Icon';

export interface IDuplexButtonProps extends ButtonProps {
  onClickInactive?: React.EventHandler<React.SyntheticEvent>;
  onClickActive?: React.EventHandler<React.SyntheticEvent>;
  inactiveLabel?: string;
  activeLabel?: string;
  activeHoverLabel?: string;
  active: boolean;
  activeIcon?: JSX.Element;
  activeHoverIcon?: JSX.Element;
  loading?: boolean;
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
    activeIcon,
    activeHoverIcon,
    allowMinimization,
    loading,
  } = props;

  const [hovered, setHovered] = React.useState(false);

  const activeHoverIconElem = activeHoverIcon || icon;
  const activeIconElem = activeIcon || icon;

  if (loading) {
    return <Button icon={<Icon type="loading" accentColor={true} />} />;
  }

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
      icon={active ? (hovered ? activeHoverIconElem : activeIconElem) : icon}
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
