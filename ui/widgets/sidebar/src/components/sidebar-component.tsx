import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import { EventTypes, MenuItemAreaType, IMenuItem } from '@akashaorg/typings/lib/ui';
import { AUTH_EVENTS, WEB3_EVENTS } from '@akashaorg/typings/lib/sdk/events';
import {
  useLogout,
  LOGIN_STATE_KEY,
  useDismissedCard,
  useRootComponentProps,
  useLoggedIn,
} from '@akashaorg/ui-awf-hooks';
import { startMobileSidebarHidingBreakpoint } from '@akashaorg/design-system-core/lib/utils/breakpoints';
import getSDK from '@akashaorg/awf-sdk';

import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import {
  Discord,
  Github,
  Telegram,
  Twitter,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ListSidebarApps from './list-sidebar-apps';
import SidebarCTACard from './cta-card';
import SidebarHeader from './sidebar-header';
import FallbackHeader from './fallback-header';

const SidebarComponent: React.FC<unknown> = () => {
  const {
    uiEvents,
    plugins,
    worldConfig: { defaultApps, socialLinks },
  } = useRootComponentProps();

  const { t } = useTranslation('ui-widget-sidebar');

  const [isMobile, setIsMobile] = useState(
    window.matchMedia(startMobileSidebarHidingBreakpoint).matches,
  );
  const [routeData, setRouteData] = useState(null);
  const [activeOption, setActiveOption] = useState<IMenuItem | null>(null);
  const [clickedOptions, setClickedOptions] = useState<{ name: string; route: IMenuItem }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoggedIn, authenticatedDID } = useLoggedIn();
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();

  const [dismissed, dismissCard] = useDismissedCard('@akashaorg/ui-widget-sidebar_cta-card');

  const routing = plugins['@akashaorg/app-routing']?.routing;

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const mql = window.matchMedia(startMobileSidebarHidingBreakpoint);

    const resize = () => {
      setIsMobile(mql.matches);
    };

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const sdk = getSDK();

    const subSDK = sdk.api.globalChannel.subscribe({
      next: (eventData: { data: { name: string }; event: AUTH_EVENTS | WEB3_EVENTS }) => {
        if (eventData.event === AUTH_EVENTS.CONNECT_ADDRESS && !isLoggedIn) {
          setIsLoading(true);
          return;
        }
        //listener in case user rejects signin popup
        if (eventData.event === WEB3_EVENTS.DISCONNECTED) {
          setIsLoading(false);
          return;
        }
      },
    });

    return () => {
      subSDK.unsubscribe();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    let sub;
    if (routing) {
      sub = routing.routeObserver.subscribe({
        next: routeData => {
          setRouteData({ ...routeData.byArea });
        },
      });
    }
    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [routing]);

  // sort according to worldConfig index
  const worldApps = useMemo(() => {
    return routeData?.[MenuItemAreaType.AppArea]?.sort(
      (a: { name: string }, b: { name: string }) => {
        if (defaultApps.indexOf(a.name) < defaultApps.indexOf(b.name)) {
          return -1;
        } else if (defaultApps.indexOf(a.name) > defaultApps.indexOf(b.name)) {
          return 1;
        }
        return 0;
      },
    );
  }, [defaultApps, routeData]);

  const userInstalledApps = useMemo(() => {
    return routeData?.[MenuItemAreaType.UserAppArea];
  }, [routeData]);

  const handleNavigation = (appName: string, route: string) => {
    routing?.navigateTo({
      appName,
      getNavigationUrl: () => route,
    });
  };

  const handleAvatarClick = function (did: string) {
    if (!did) {
      return;
    }
    routing?.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${did}`,
    });

    if (isMobile) {
      handleSidebarClose();
    }
  };

  const handleClickExplore = () => {
    routing?.navigateTo({
      appName: '@akashaorg/app-extensions',
      getNavigationUrl: routes => routes.explore,
    });

    if (isMobile) {
      handleSidebarClose();
    }
  };

  const handleSidebarClose = () => {
    // emit HideSidebar event to trigger corresponding action in associated widgets
    uiEvents.next({
      event: EventTypes.HideSidebar,
    });
  };

  function handleLoginClick() {
    handleNavigation('@akashaorg/app-auth-ewa', '/');

    if (isMobile) {
      handleSidebarClose();
    }
  }

  function handleLogout() {
    setIsLoading(true);

    queryClient.setQueryData([LOGIN_STATE_KEY], null);
    logoutMutation.mutate();

    setIsLoading(false);
  }

  const handleLogoutClick = () => {
    handleLogout();
  };

  const handleAppIconClick = (menuItem: IMenuItem) => {
    if (menuItem.subRoutes && menuItem.subRoutes.length === 0) {
      setActiveOption(null);
      handleNavigation(menuItem.name, menuItem.route);
      if (isMobile) {
        handleSidebarClose();
      }
    }
  };

  const handleOptionClick = (menuItem: IMenuItem, subrouteMenuItem: IMenuItem) => {
    setClickedOptions(oldClickedOptions => [
      ...oldClickedOptions,
      { name: menuItem.name, route: subrouteMenuItem },
    ]);
    setActiveOption(subrouteMenuItem);
    handleNavigation(menuItem.name, subrouteMenuItem.route);
    if (isMobile) {
      handleSidebarClose();
    }
  };

  const handleBackNavEvent = () => {
    const matchedRoute = clickedOptions.find(option =>
      location.pathname.includes(`${option.name}${option.route?.route}`),
    );

    if (matchedRoute) setActiveOption(matchedRoute.route);
    else setActiveOption(null);
  };

  useEffect(() => {
    window.addEventListener('popstate', handleBackNavEvent);
    return () => window.removeEventListener('popstate', handleBackNavEvent);
  });

  /**
   * this assigns the corresponding icons to the social links from root components
   */
  const modSocialLinks = socialLinks.map(el => {
    if (el.icon === 'Github') return { ...el, icon: <Github /> };
    if (el.icon === 'Discord') return { ...el, icon: <Discord /> };
    if (el.icon === 'Telegram') return { ...el, icon: <Telegram /> };
    if (el.icon === 'Twitter') return { ...el, icon: <Twitter /> };
  });

  return (
    <Card
      customStyle="w-[19.5rem] max-w-[19.5rem] max-h(screen xl:[calc(100vh-20px)]) h(full xl:fit)"
      radius="rounded-r-2xl xl:rounded-2xl"
      padding="p-0"
    >
      <Suspense
        fallback={<FallbackHeader authenticatedDID={authenticatedDID} isLoggedIn={isLoggedIn} />}
      >
        <SidebarHeader
          authenticatedDID={authenticatedDID}
          isLoggedIn={isLoggedIn}
          logoutClickHandler={handleLogoutClick}
          loginClickHandler={handleLoginClick}
          isLoading={isLoading}
          handleAvatarClick={handleAvatarClick}
        />
      </Suspense>
      {/*
          this container will grow up to a max height of 68vh, 32vh currently accounts for the height of other sections and paddings. Adjust accordingly, if necessary.
        */}
      <Stack direction="column" customStyle="overflow-auto">
        {/* container for world apps */}
        {worldApps?.length > 0 && (
          <ListSidebarApps
            list={worldApps}
            activeOption={activeOption}
            onOptionClick={handleOptionClick}
            onClickMenuItem={handleAppIconClick}
          />
        )}
        {/* container for user-installed apps */}
        {userInstalledApps?.length > 0 && (
          <ListSidebarApps
            list={userInstalledApps}
            activeOption={activeOption}
            hasBorderTop={true}
            onOptionClick={handleOptionClick}
            onClickMenuItem={handleAppIconClick}
          />
        )}
      </Stack>
      {!dismissed && (
        <SidebarCTACard onClickCTAButton={handleClickExplore} onDismissCard={dismissCard} />
      )}
      {modSocialLinks.length > 0 && (
        <Stack padding="px-8 py-4" customStyle="border-t-1 border(grey9 dark:grey3)">
          <Text variant="footnotes2">{t('Get in touch')}</Text>
          <Stack direction="row" customStyle="w-fit h-fit mt-6">
            {modSocialLinks.map((socialLink, idx) => (
              <Anchor
                key={idx}
                href={socialLink.link}
                target="_blank"
                rel="noreferrer noopener"
                customStyle="mr-4"
              >
                <Button
                  icon={socialLink.icon}
                  solidIcon={idx > 0}
                  variant="primary"
                  greyBg={true}
                  iconOnly={true}
                />
              </Anchor>
            ))}
          </Stack>
        </Stack>
      )}
    </Card>
  );
};
export default SidebarComponent;
