import React from 'react';
import { apply, tw } from '@twind/core';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

export interface ITopbarProps {
  // data
  versionURL?: string;
  hasNewNotifications?: boolean;
  currentLocation?: string;
  // sidebar
  sidebarVisible: boolean;
  // handlers
  onSidebarToggle?: () => void;
  onBackClick: () => void;
  onAppWidgetClick: () => void;
  onBrandClick?: () => void;
  onNotificationClick: () => void;
  // external css
  className?: string;
  modalSlotId: string;
}

const Topbar: React.FC<ITopbarProps> = props => {
  const {
    className = '',
    sidebarVisible,
    onSidebarToggle,
    onBrandClick,
    onAppWidgetClick,
    onNotificationClick,
    onBackClick,
    hasNewNotifications = false,
  } = props;

  const [displayWidgetTogglingButton, setDisplayWidgetTogglingButton] = React.useState(
    window.matchMedia('(max-width: 768px)').matches,
  );

  React.useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const resize = e => {
      setDisplayWidgetTogglingButton(e.matches);
    };
    mql.addEventListener('change', resize);

    return () => {
      mql.removeEventListener('change', resize);
    };
  }, []);

  const BaseStyle = apply`
    flex justify-between items-center w-full
    py-1.5 px-2 space-x-4
    border(1 grey8) rounded-none sm:rounded-md shadow-sm
    bg-white dark:bg-black
    xs:(fixed top-0 z-50)
    `;

  const instanceStyle = apply`
  ${BaseStyle}
  ${className}
  `;

  return (
    <div className={tw(instanceStyle)}>
      <div className={tw('flex space-x-2')}>
        {!sidebarVisible ? (
          <Button
            iconOnly={true}
            icon="ArrowRightOnRectangleIcon"
            onClick={onSidebarToggle}
            greyBg={true}
            variant="primary"
          />
        ) : (
          <Button
            iconOnly={true}
            icon="ArrowLeftOnRectangleIcon"
            onClick={onSidebarToggle}
            greyBg={true}
            variant="primary"
          />
        )}
        <Button
          iconOnly={true}
          greyBg={true}
          variant="primary"
          icon="ChevronLeftIcon"
          onClick={onBackClick}
        />
      </div>

      <div
        className={tw('p-0 m-0 cursor-pointer flex(& col) justify-center items-center')}
        onClick={onBrandClick}
      >
        <Icon type="akasha" customStyle="w-18 h-8" />
        <span className={tw('uppercase font([Inter] light) text-xs drop-shadow-md')}>
          Akasha World
        </span>
      </div>

      <div className={tw('flex space-x-2')}>
        {displayWidgetTogglingButton && (
          <Button iconOnly={true} icon="appCenter" onClick={onAppWidgetClick} variant="primary" />
        )}
        <Button
          iconOnly={true}
          icon={hasNewNotifications ? 'BellAlertIcon' : 'BellIcon'}
          onClick={onNotificationClick}
          greyBg={true}
          variant="primary"
        />
      </div>
    </div>
  );
};

Topbar.defaultProps = {
  onBackClick: () => {
    return;
  },
  onBrandClick: () => {
    return;
  },
};

export default Topbar;
