import React, { useEffect, useState, EventHandler, SyntheticEvent } from 'react';

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
  activeIcon?: React.ReactElement;
  activeHoverIcon?: React.ReactElement;
  allowMinimization?: boolean;
  fixedWidth?: string;
};

const DuplexButton = (props: DuplexButtonProps) => {
  const {
    onClickActive,
    onClickInactive,
    size = 'sm',
    customStyle = '',
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
    fixedWidth,
    ...rest
  } = props;

  const [hovered, setHovered] = useState(false);
  const [iconOnly, setIconOnly] = useState(window.matchMedia('(max-width: 992px)').matches);
  const activeHoverIconElem = activeHoverIcon ?? icon;
  const activeIconElem = activeIcon ?? icon;

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
    return <Button loading={true} customStyle={fixedWidth} {...rest} />;
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
        customStyle={fixedWidth}
      >
        <Icon
          icon={getIcon()}
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
      customStyle={`${customStyle} ${fixedWidth}`}
      {...rest}
    />
  );
};

export default DuplexButton;
