import * as React from 'react';
import Button, { IButtonProps } from '../Button';
import Icon from '../Icon/';
import { tw } from '@twind/core';
import { IconType } from '@akashaorg/typings/ui';

export interface IDuplexButtonProps extends IButtonProps {
  onClickInactive?: () => void;
  onClickActive?: () => void;
  inactiveLabel?: string;
  activeLabel?: string;
  active?: boolean;
  activeIcon?: IconType;
  allowMinimization?: boolean;
  style?: React.CSSProperties;
}

const DuplexButton = (props: IDuplexButtonProps) => {
  const {
    onClickActive,
    onClickInactive,
    inactiveLabel,
    activeLabel,
    active,
    icon,
    activeIcon,
    allowMinimization,
    loading,
  } = props;

  const [iconOnly, setIconOnly] = React.useState(window.matchMedia('(max-width: 992px)').matches);
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
        className={tw('rounded-sm border-1 border-secondary-light p-1')}
      >
        <Icon type={active ? activeIconElem : icon} styling="text-secondary-light h-5 w-5" />
      </button>
    );
  }

  return (
    <Button
      data-testid="duplex-button"
      primary={!active}
      label={active ? activeLabel : inactiveLabel}
      onClick={active ? onClickActive : onClickInactive}
      size="small"
    />
  );
};

DuplexButton.defaultProps = {
  inactiveLabel: 'Follow',
  activeLabel: 'Unfollow',
  active: false,
};

export default DuplexButton;
