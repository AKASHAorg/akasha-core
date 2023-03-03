import React from 'react';
import { apply, tw } from '@twind/core';
import DS from '@akashaorg/design-system-core';
import { isMobileOnly } from 'react-device-detect';

const { Button, Icon } = DS;

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
    modalSlotId,
  } = props;

  const iconSize = 'regular';
  const [displayWidgetTogglingButton, setDisplayWidgetTogglingButton] = React.useState(
    window.matchMedia('(max-width: 768px)').matches,
  );

  React.useEffect(() => {
    console.log('sidebarVisible', sidebarVisible);
  }, [sidebarVisible]);

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
            size={iconSize}
            onClick={onSidebarToggle}
            // greyBg={true}
            primary={true}
          />
        ) : (
          <Button
            iconOnly={true}
            icon="ArrowLeftOnRectangleIcon"
            size={iconSize}
            onClick={onSidebarToggle}
            // greyBg={true}
            primary={true}
          />
        )}
        <Button
          iconOnly={true}
          greyBg={true}
          primary={true}
          icon="ChevronLeftIcon"
          size={iconSize}
          onClick={onBackClick}
        />
      </div>

      <div
        className={tw('p-0 m-0 cursor-pointer flex(& col) justify-center items-center')}
        onClick={onBrandClick}
      >
        <Icon type="akasha" styling="w-18 h-8" />
        <span className={tw('uppercase font([Inter] light) text-xs drop-shadow-md')}>
          Akasha World
        </span>
      </div>

      <div className={tw('flex space-x-2')}>
        {displayWidgetTogglingButton && (
          <Button
            iconOnly={true}
            icon="appCenter"
            size={iconSize}
            onClick={onAppWidgetClick}
            primary={true}
          />
        )}
        <Button
          iconOnly={true}
          icon={hasNewNotifications ? 'BellAlertIcon' : 'BellIcon'}
          size={iconSize}
          onClick={onNotificationClick}
          greyBg={true}
          primary={true}
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
