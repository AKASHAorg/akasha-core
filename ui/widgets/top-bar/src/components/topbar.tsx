import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { startWidgetsTogglingBreakpoint } from '@akashaorg/design-system-core/lib/utils/breakpoints';

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

const notificationIcon = function (snoozeNotifications, hasNewNotifications) {
  if (snoozeNotifications) {
    return 'BellSnoozeIcon';
  }
  return hasNewNotifications ? 'BellAlertIcon' : 'BellIcon';
};

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
    !window.matchMedia(startWidgetsTogglingBreakpoint).matches,
  );
  React.useEffect(() => {
    const mql = window.matchMedia(startWidgetsTogglingBreakpoint);
    const resize = e => {
      setDisplayWidgetTogglingButton(!e.matches);
    };
    mql.addEventListener('change', resize);
    return () => {
      mql.removeEventListener('change', resize);
    };
  }, []);

  const customStyle =
    'flex-row justify-between items-center py-1.5 px-2 space-x-4 xs:(fixed top-0 z-8)';
  return (
    <BasicCardBox customStyle={customStyle}>
      <Box customStyle="flex space-x-2">
        <Button
          iconOnly={true}
          icon={sidebarVisible ? 'ArrowLeftOnRectangleIcon' : 'ArrowRightOnRectangleIcon'}
          onClick={onSidebarToggle}
          greyBg={true}
          variant="primary"
        />
        <Button
          iconOnly={true}
          greyBg={true}
          variant="primary"
          icon="ChevronLeftIcon"
          onClick={onBackClick}
        />
      </Box>
      <Button plain={true} customStyle="p-0 !ml-0 cursor-pointer" onClick={onBrandClick}>
        <Stack align="center" justify="center" direction="column">
          <Icon type="akasha" customStyle="w-18 h-7" />
          <Text customStyle="uppercase font([Inter] light) text(xs black dark:white) drop-shadow-md">
            Akasha World
          </Text>
        </Stack>
      </Button>
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
                icon={notificationIcon(snoozeNotifications, hasNewNotifications)}
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
            icon={notificationIcon(snoozeNotifications, hasNewNotifications)}
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
