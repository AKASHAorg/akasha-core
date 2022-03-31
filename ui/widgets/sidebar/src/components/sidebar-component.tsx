import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import DS from '@akashaproject/design-system';
import { useCheckNewNotifications, useGetLogin } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { EventTypes, MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';

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
    margin-right: 0.8rem;
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    height: 100vh;
    width: 85vw;
  }
`;

const SidebarOverlay = styled(Box)`
  display: none;
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    display: initial;
    width: 100%;
    height: 100vh;
    position: fixed;
    background-color: ${props => props.theme.colors.background};
    opacity: 0.8;
  }
`;

const SidebarComponent: React.FC<RootComponentProps> = props => {
  const {
    uiEvents,
    plugins: { routing },
    worldConfig: { defaultApps },
  } = props;

  const [routeData, setRouteData] = React.useState({});

  const { t } = useTranslation('ui-widget-sidebar');

  const currentLocation = useLocation();

  const { size } = useViewportSize();

  const loginQuery = useGetLogin();

  // check for new notifcations
  const checkNotifsReq = useCheckNewNotifications(
    loginQuery.data.isReady && loginQuery.data.ethAddress,
  );

  React.useEffect(() => {
    let sub;
    if (props.plugins.routing) {
      sub = props.plugins.routing.routeObserver.subscribe({
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
  }, [props.plugins.routing]);

  // sort according to worldConfig index
  const worldApps = routeData?.[MenuItemAreaType.AppArea]?.sort(
    (a: { name: string }, b: { name: string }) => {
      if (defaultApps.indexOf(a.name) < defaultApps.indexOf(b.name)) {
        return -1;
      } else if (defaultApps.indexOf(a.name) > defaultApps.indexOf(b.name)) {
        return 1;
      }
      return 0;
    },
  );
  const userInstalledApps = routeData?.[MenuItemAreaType.UserAppArea];

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
      (menuItem: { name: string }) => menuItem.name === '@akashaproject/app-integration-center',
    );

    // if found, navigate to route
    if (icApp) {
      routing.navigateTo({
        appName: icApp.name,
        getNavigationUrl: () => icApp.route,
      });
    }
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
        worldAppsTitleLabel={t('World Apps')}
        poweredByLabel="Powered by AKASHA"
        userInstalledAppsTitleLabel={t('Apps')}
        userInstalledApps={userInstalledApps}
        exploreButtonLabel={t('Explore')}
        allMenuItems={[]}
        worldApps={worldApps}
        currentRoute={currentLocation.pathname}
        size={size}
        isLoggedIn={!!loginQuery.data.ethAddress}
        hasNewNotifs={checkNotifsReq.data}
        loadingUserInstalledApps={false}
        onSidebarClose={handleSidebarClose}
        onClickMenuItem={handleNavigation}
        onClickExplore={handleClickExplore}
      />
    </>
  );
};

export default SidebarComponent;
