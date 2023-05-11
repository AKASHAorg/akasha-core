import React from 'react';
import { tw } from '@twind/core';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';

export interface ITopbarProps {
  // data
  versionURL?: string;
  hasNewNotifications?: boolean;
  snoozeNotifications?: boolean;
  currentLocation?: string;
  // sidebar
  sidebarVisible: boolean;
  // isLoggedIn ?
  isLoggedIn: boolean;
  // handlers
  onSidebarToggle?: () => void;
  onBackClick: () => void;
  onAppWidgetClick: () => void;
  onBrandClick?: () => void;
  onNotificationClick: () => void;
  onLoginClick: () => void;
  modalSlotId: string;
}
const Topbar: React.FC<ITopbarProps> = props => {
  const {
    isLoggedIn,
    sidebarVisible,
    onSidebarToggle,
    onBrandClick,
    onAppWidgetClick,
    onNotificationClick,
    onBackClick,
    onLoginClick,
    hasNewNotifications = false,
    snoozeNotifications,
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
  const BaseStyle =
    'flex-row justify-between items-center py-1.5 px-2 space-x-4 xs:(fixed top-0 z-50)';
  return (
    <BasicCardBox elevation="sm" style={BaseStyle}>
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
        <span
          className={tw('uppercase font([Inter] light) text(xs black dark:white) drop-shadow-md')}
        >
          Akasha World
        </span>
      </div>
      <div className={tw('flex space-x-2')}>
        {displayWidgetTogglingButton ? (
          isLoggedIn ? (
            <>
              <Button
                iconOnly={true}
                icon="appCenter"
                onClick={onAppWidgetClick}
                variant="primary"
              />
              <Button
                iconOnly={true}
                icon={
                  snoozeNotifications
                    ? 'BellSnoozeIcon'
                    : hasNewNotifications
                    ? 'BellAlertIcon'
                    : 'BellIcon'
                }
                onClick={onNotificationClick}
                greyBg={true}
                variant="primary"
              />
            </>
          ) : (
            <Button iconOnly={true} icon="BoltIcon" onClick={onLoginClick} variant="primary" />
          )
        ) : (
          <Button
            iconOnly={true}
            icon={
              snoozeNotifications
                ? 'BellSnoozeIcon'
                : hasNewNotifications
                ? 'BellAlertIcon'
                : 'BellIcon'
            }
            onClick={onNotificationClick}
            greyBg={true}
            variant="primary"
          />
        )}
      </div>
    </BasicCardBox>
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
