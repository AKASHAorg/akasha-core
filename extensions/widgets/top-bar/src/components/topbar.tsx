import React, { useEffect, useState } from 'react';
import { useTheme } from '@akashaorg/ui-core-hooks';
import { ThemingEvents } from '@akashaorg/typings/lib/ui';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  ChevronLeftIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Akasha } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { startWidgetsTogglingBreakpoint } from '@akashaorg/design-system-core/lib/utils/breakpoints';
import { useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';

export interface ITopbarProps {
  // data
  versionURL?: string;
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
  modalSlotId: string;
}

type WorldIconProps = {
  fallback: React.ReactElement;
};

type ThemeEvent = Event & {
  detail: { theme: 'Light-Theme' | 'Dark-Theme' };
};

const WorldIcon = (props: WorldIconProps) => {
  const { fallback } = props;

  const { theme } = useTheme();
  const [curTheme, setCurTheme] = useState(theme);

  const {
    worldConfig: { worldIcon },
  } = useRootComponentProps();

  useEffect(() => {
    const handleSetTheme = (ev: ThemeEvent) => setCurTheme(ev.detail.theme);
    window.addEventListener(ThemingEvents.ThemeChange, handleSetTheme);
  }, []);

  if (worldIcon) {
    const isLightTheme = curTheme === 'Light-Theme';

    const smallImagePath = `${worldIcon.basePath}${worldIcon.small}${
      isLightTheme ? worldIcon.darkModeSuffix : ''
    }${worldIcon.extension}`;

    const mediumImagePath = `${worldIcon.basePath}${worldIcon.medium}${
      isLightTheme ? worldIcon.darkModeSuffix : ''
    }${worldIcon.extension}`;

    return (
      <img
        loading="lazy"
        decoding="async"
        alt="world logo"
        height="1.5rem"
        className="mb-1"
        src={`${smallImagePath}`}
        srcSet={`${smallImagePath}, ${mediumImagePath} 2x`}
      />
    );
  }
  return <Icon icon={fallback} solid={true} customStyle="w-18 h-7" />;
};

const Topbar: React.FC<ITopbarProps> = props => {
  const {
    isLoggedIn,
    sidebarVisible,
    onSidebarToggle,
    onBrandClick = () => {
      return;
    },
    onAppWidgetClick,
    onBackClick = () => {
      return;
    },
  } = props;

  const [displayWidgetTogglingButton, setDisplayWidgetTogglingButton] = React.useState(
    !window.matchMedia(startWidgetsTogglingBreakpoint).matches,
  );
  React.useEffect(() => {
    const mql = window.matchMedia(startWidgetsTogglingBreakpoint);
    const resize = () => {
      setDisplayWidgetTogglingButton(!mql.matches);
    };
    mql.addEventListener('change', resize);
    return () => {
      mql.removeEventListener('change', resize);
    };
  }, []);

  return (
    <Card className="flex flex-row justify-between items-center py-1.5 px-2 space-x-4 xs:fixed xs:top-0 xs:z-8">
      <Stack direction="row" spacing={2}>
        <Button variant="outline" size="icon" onClick={onSidebarToggle}>
          {sidebarVisible ? <ArrowLeftEndOnRectangleIcon /> : <ArrowRightEndOnRectangleIcon />}{' '}
        </Button>
        <Button variant="outline" size="icon" onClick={onBackClick}>
          <ChevronLeftIcon />
        </Button>
      </Stack>
      <button onClick={onBrandClick} className="p-0 !ml-0 cursor-pointer">
        <Stack alignItems="center" justifyContent="center" direction="column" spacing={1}>
          <WorldIcon fallback={<Akasha />} />
          <Pill
            type="info"
            label="Alpha"
            weight="light"
            color="white"
            size="xs"
            background={{ light: 'errorLight', dark: 'errorDark' }}
            borderColor={{ light: 'errorLight', dark: 'errorDark' }}
          />
        </Stack>
      </button>
      <Stack direction="row" spacing={2}>
        {!isLoggedIn && <Extension name="topbar_login_button" />}
        {isLoggedIn && (
          <>
            {displayWidgetTogglingButton && (
              <Button variant="outline" size="icon" onClick={onAppWidgetClick}>
                <Akasha />
              </Button>
            )}
            <Extension name="topbar_notification_button" />
          </>
        )}
      </Stack>
    </Card>
  );
};

export default Topbar;
