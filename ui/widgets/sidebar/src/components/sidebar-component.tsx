import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { MenuItem } from './sidebar-menu-item';
import DS from '@akashaorg/design-system';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps, EventTypes, MenuItemAreaType } from '@akashaorg/typings/ui';
import { SidebarMenuItemProps } from '@akashaorg/design-system/lib/components/SideBar/sidebar-menu-item';

const { Box, styled, Sidebar, useViewportSize } = DS;

const AppSidebar = styled(Sidebar)`
  height: calc(100vh - 3rem);
  min-width: 15em;
  background-color: ${props => props.theme.colors.cardBackground};
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    min-width: 13em;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.large.value}px) {
    max-width: 17em;
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    height: 100vh;
    width: 85vw;
  }
`;

const SidebarOverlay = styled(Box)`
  width: 100%;
  opacity: 0.8;
  height: 100vh;
  position: fixed;
  background-color: ${props => props.theme.colors.overlay};
  /* hide overlay from large desktop breakpoint */
  @media screen and (min-width: ${props => props.theme.breakpoints.largeDesktop.value}px) {
    display: none;
  }
`;

const SidebarComponent: React.FC<RootComponentProps> = props => {
  const {
    uiEvents,
    plugins: { routing },
    worldConfig: { defaultApps, homepageApp },
  } = props;

  const [routeData, setRouteData] = React.useState(null);
  const [activeIntegrations, setActiveIntegrations] = React.useState(null);

  const { t } = useTranslation('ui-widget-sidebar');

  const currentLocation = useLocation();

  const { size } = useViewportSize();

  const loginQuery = useGetLogin();

  React.useEffect(() => {
    let sub;
    if (routing) {
      sub = routing.routeObserver.subscribe({
        next: routeData => {
          setRouteData({ ...routeData.byArea });
          setActiveIntegrations({ ...routeData.activeIntegrationNames });
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
  const worldApps = React.useMemo(() => {
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

  const userInstalledApps = React.useMemo(() => {
    return routeData?.[MenuItemAreaType.UserAppArea];
  }, [routeData]);

  const allApps = React.useMemo(() => {
    return [...(worldApps || []), ...(userInstalledApps || [])];
  }, [worldApps, userInstalledApps]);

  const handleNavigation = (appName: string, route: string) => {
    routing.navigateTo({
      appName,
      getNavigationUrl: () => route,
    });
  };

  const handleClickExplore = () => {
    // find IC app from world apps
    // @TODO: replace string with a constant
    const icApp = worldApps.find(
      (menuItem: { name: string }) => menuItem.name === '@akashaorg/app-integration-center',
    );

    // if found, navigate to route
    if (icApp) {
      routing.navigateTo({
        appName: icApp.name,
        getNavigationUrl: () => icApp.route,
      });
    }
  };

  const handleBrandClick = () => {
    if (!homepageApp) {
      return;
    }

    const homeAppRoutes = props.getAppRoutes(homepageApp);

    if (homeAppRoutes && homeAppRoutes.hasOwnProperty('defaultRoute')) {
      if (location.pathname === homeAppRoutes.defaultRoute) {
        scrollTo(0, 0);
      } else {
        routing.navigateTo({
          appName: 'Ethereum World',
          getNavigationUrl: () => homeAppRoutes.defaultRoute,
        });
      }
    }
    // close sidebar after navigation
    handleSidebarClose();
  };

  const handleSidebarClose = () => {
    // emit HideSidebar event to trigger corresponding action in associated widgets
    uiEvents.next({
      event: EventTypes.HideSidebar,
    });
  };

  return (
    <>
      <SidebarOverlay onClick={handleSidebarClose} />
      <AppSidebar
        versionLabel="ALPHA"
        versionURL="https://github.com/AKASHAorg/akasha-world-framework/discussions/categories/general"
        worldAppsTitleLabel={t('World Apps')}
        poweredByLabel="Powered by AKASHA"
        userInstalledAppsTitleLabel={t('Apps')}
        userInstalledApps={userInstalledApps}
        exploreButtonLabel={t('Explore')}
        allMenuItems={allApps}
        activeApps={activeIntegrations?.apps}
        worldApps={worldApps}
        currentRoute={currentLocation.pathname}
        size={size}
        isLoggedIn={!!loginQuery.data.ethAddress}
        loadingUserInstalledApps={false}
        onBrandClick={handleBrandClick}
        onSidebarClose={handleSidebarClose}
        onClickMenuItem={handleNavigation}
        onClickExplore={handleClickExplore}
        /* Menu item will surely have the props,
           but typescript is not able to infer it
           because the cloneElement is used
        */
        menuItem={<MenuItem plugins={props.plugins} {...({} as SidebarMenuItemProps)} />}
      />
    </>
  );
};

export default SidebarComponent;
