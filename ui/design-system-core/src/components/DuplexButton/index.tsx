import React, { useEffect, useState, EventHandler, SyntheticEvent } from 'react';
import Button from '../Button';
import Icon from '../Icon/';
import { tw } from '@twind/core';
import { IconType } from '@akashaorg/typings/ui';
import { ButtonProps } from '../Button/types';

export type DuplexButtonProps = ButtonProps & {
  onClickInactive?: EventHandler<SyntheticEvent>;
  onClickActive?: EventHandler<SyntheticEvent>;
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

  const [hovered, setHovered] = useState(false);
  const [iconOnly, setIconOnly] = useState(window.matchMedia('(max-width: 992px)').matches);
  const activeHoverIconElem = activeHoverIcon || icon;
  const activeIconElem = activeIcon || icon;

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 992px)');
    const resize = e => {
      setIconOnly(e.matches);
    };
    mql.addEventListener('change', resize);

    return () => {
      mql.removeEventListener('change', resize);
    };
  }, []);

  useEffect(() => {
    //Reset hovered state when button is set as active
    if (active) setHovered(false);
  }, [active]);

  if (loading) {
    return <Button loading={true} />;
  }

  const getLabel = () => {
    if (active) return hovered ? activeHoverLabel : activeLabel;
    return inactiveLabel;
  };

  const getIcon = () => {
    if (active) return hovered ? activeHoverIconElem : activeIconElem;
    return icon;
  };

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
        <Icon type={getIcon()} customStyle="text-secondaryLight h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      data-testid="duplex-button"
      label={getLabel()}
      onClick={active ? onClickActive : onClickInactive}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      icon={getIcon()}
      variant={active ? 'secondary' : 'primary'}
      size={size}
      customStyle={customStyle}
    />
  );
};

DuplexButton.defaultProps = {
  inactiveLabel: 'Activate',
  activeLabel: 'Activated',
  activeHoverLabel: 'Deactivate',
  active: false,
};

export default DuplexButton;
