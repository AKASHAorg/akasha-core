import * as React from 'react';
import Button, { IButtonProps } from '../Button';
import Icon from '../Icon/';
import { apply, tw } from '@twind/core';
import { IconType } from '@akashaorg/typings/ui';

export interface IDuplexButtonProps extends IButtonProps {
  onClickInactive?: () => void;
  onClickActive?: () => void;
  inactiveLabel?: string;
  activeLabel?: string;
  activeHoverLabel?: string;
  active?: boolean;
  activeIcon?: IconType;
  activeHoverIcon?: IconType;
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
    icon,
    activeIcon,
    activeHoverIcon,
    allowMinimization,
    loading,
  } = props;

  const [hovered, setHovered] = React.useState(false);
  const [iconOnly, setIconOnly] = React.useState(window.matchMedia('(max-width: 992px)').matches);
  const activeHoverIconElem = activeHoverIcon || icon;
  const activeIconElem = activeIcon || icon;

  React.useEffect(() => {
    const mql = window.matchMedia('(max-width: 992px)');
    const resize = e => {
      setIconOnly(e.matches);
    };
    mql.addEventListener('change', resize);

    return () => {
      mql.removeEventListener('change', resize);
    };
  }, []);

  if (loading) {
    return <Button loading={true} />;
  }

  if (iconOnly && allowMinimization) {
    return (
      <button
        data-testid="duplex-button"
        onClick={active ? onClickActive : onClickInactive}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={tw(apply('rounded-sm border-1 border-secondary-light p-1'))}
      >
        <Icon
          type={active ? (hovered ? activeHoverIconElem : activeIconElem) : icon}
          styling="text-secondary-light h-5 w-5"
        />
      </button>
    );
  }

  return (
    <Button
      data-testid="duplex-button"
      label={active ? (hovered ? activeHoverLabel : activeLabel) : inactiveLabel}
      onClick={active ? onClickActive : onClickInactive}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      icon={active ? (hovered ? activeHoverIconElem : activeIconElem) : icon}
      size="small"
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
