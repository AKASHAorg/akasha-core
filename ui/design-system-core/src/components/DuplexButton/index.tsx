import React, { useEffect, useState, EventHandler, SyntheticEvent } from 'react';

import { IconType } from '@akashaorg/typings/lib/ui';

import Button from '../Button';
import Icon from '../Icon/';
import { ButtonProps } from '../Button/types';

export type DuplexButtonProps = Omit<ButtonProps, 'label'> & {
  onClickInactive?: EventHandler<SyntheticEvent>;
  onClickActive?: EventHandler<SyntheticEvent>;
  inactiveLabel?: string;
  inactiveVariant?: ButtonProps['variant'];
  activeLabel?: string;
  activeVariant?: ButtonProps['variant'];
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
    inactiveVariant = 'primary',
    activeLabel,
    activeVariant = 'secondary',
    activeHoverLabel,
    active,
    icon,
    activeIcon,
    activeHoverIcon,
    allowMinimization,
    loading,
    ...rest
  } = props;

  const [hovered, setHovered] = useState(false);
  const [iconOnly, setIconOnly] = useState(window.matchMedia('(max-width: 992px)').matches);
  const activeHoverIconElem = activeHoverIcon ?? icon;
  const activeIconElem = activeIcon ?? icon;
  const fixWidth = 'w-[7rem]';

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
    return <Button loading={true} customStyle={fixWidth} {...rest} />;
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
        onClick={active ? onClickActive : onClickInactive}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        plain
        customStyle={fixWidth}
      >
        <Icon
          type={getIcon()}
          customStyle="text-secondaryLight h-5 w-5 rounded-sm border-1 border-secondaryLight p-1"
        />
      </Button>
    );
  }

  return (
    <Button
      label={getLabel()}
      onClick={active ? onClickActive : onClickInactive}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      icon={getIcon()}
      variant={active ? activeVariant : inactiveVariant}
      size={size}
      hover={hovered && active}
      customStyle={`${customStyle} ${fixWidth}`}
      {...rest}
    />
  );
};

export default DuplexButton;
