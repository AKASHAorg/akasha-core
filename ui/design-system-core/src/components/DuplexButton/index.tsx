import * as React from 'react';
import Button from '../Button';
import Icon from '../Icon/';
import { tw } from '@twind/core';
import { IconType } from '@akashaorg/typings/ui';
import { ButtonProps } from '../Button/types';

export type DuplexButtonProps = ButtonProps & {
  onClickInactive?: () => void;
  onClickActive?: () => void;
  inactiveLabel?: string;
  activeLabel?: string;
  activeHoverLabel?: string;
  active?: boolean;
  activeIcon?: IconType;
  activeHoverIcon?: IconType;
  allowMinimization?: boolean;
};

const DuplexButton = (props: DuplexButtonProps) => {
  const {
    onClickActive,
    onClickInactive,
    size = 'sm',
    customStyle,
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
      <Button
        data-testid="duplex-button"
        onClick={active ? onClickActive : onClickInactive}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={tw('rounded-sm border-1 border-secondaryLight p-1')}
        plain
      >
        <Icon
          type={active ? (hovered ? activeHoverIconElem : activeIconElem) : icon}
          customStyle="text-secondaryLight h-5 w-5"
        />
      </Button>
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
      variant={active ? 'secondary' : 'primary'}
      size={size}
      customStyle={customStyle}
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
