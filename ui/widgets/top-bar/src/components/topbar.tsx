import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

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

  const customStyle =
    'flex-row justify-between items-center py-1.5 px-2 space-x-4 xs:(fixed top-0 z-50)';

  const notificationIcon = React.useMemo(() => {
    if (snoozeNotifications) {
      return 'BellSnoozeIcon';
    }
    if (hasNewNotifications) {
      return 'BellAlertIcon';
    }
    return 'BellIcon';
  }, [snoozeNotifications, hasNewNotifications]);

  return (
    <BasicCardBox customStyle={customStyle}>
      <Box customStyle="flex space-x-2">
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
      </Box>
      <Box
        customStyle="p-0 m-0 cursor-pointer flex(& col) justify-center items-center"
        onClick={onBrandClick}
      >
        <Icon type="akasha" customStyle="w-18 h-8" />
        <Text customStyle="uppercase font([Inter] light) text(xs black dark:white) drop-shadow-md">
          Akasha World
        </Text>
      </Box>
      <Box customStyle="flex space-x-2">
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
                icon={notificationIcon}
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
            icon={notificationIcon}
            onClick={onNotificationClick}
            greyBg={true}
            variant="primary"
          />
        )}
      </Box>
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
