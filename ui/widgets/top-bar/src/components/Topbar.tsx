import React from 'react';
import { apply, tw } from '@twind/core';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { isMobileOnly } from 'react-device-detect';

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
    hasNewNotifications,
    modalSlotId,
  } = props;

  const iconSize = isMobileOnly ? 'small' : 'regular';
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

  const BaseStyles = apply`
    flex justify-between items-center w-full
    py-1.5 px-2 space-x-4
    border(1 grey8) rounded-none sm:rounded-md shadow-sm
    bg-white-200 dark:bg-black
    xs:(fixed top-0 z-50)
    `;

  const instanceStyles = apply`
  ${BaseStyles}
  ${className}
  `;

  return (
    <div className={tw(instanceStyles)}>
      <div className={tw('flex space-x-2')}>
        {!sidebarVisible ? (
          <Button
            iconOnly={true}
            noBorder={true}
            icon="ArrowRightOnRectangleIcon"
            size={iconSize}
            onClick={onSidebarToggle}
          />
        ) : (
          <Button
            iconOnly={true}
            noBorder={true}
            icon="ArrowLeftOnRectangleIcon"
            size={iconSize}
            onClick={onSidebarToggle}
          />
        )}
        <Button
          iconOnly={true}
          noBorder={true}
          icon="ChevronLeftIcon"
          size={iconSize}
          onClick={onBackClick}
        />
      </div>

      <div
        className={tw('p-0 m-0 cursor-pointer flex(& col) justify-center items-center')}
        onClick={onBrandClick}
      >
        <Icon icon="Akasha" styling="w-18 h-8" />
        <span className={tw('uppercase font([Inter] light) text-xs drop-shadow-md')}>
          Akasha World
        </span>
      </div>

      <div className={tw('flex space-x-2')}>
        {displayWidgetTogglingButton && (
          <Button
            iconOnly={true}
            noBorder={true}
            icon="AppCenter"
            size={iconSize}
            onClick={onAppWidgetClick}
          />
        )}
        <Button
          iconOnly={true}
          noBorder={true}
          icon={hasNewNotifications ? 'BellAlertIcon' : 'BellIcon'}
          size={iconSize}
          onClick={onNotificationClick}
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
