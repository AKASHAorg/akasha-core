import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { RootComponentProps, EventTypes, MenuItemAreaType } from '@akashaorg/typings/ui';
import { SidebarMenuItemProps } from '@akashaorg/design-system/lib/components/SideBar/sidebar-menu-item';

import Sidebar from './sidebar-new';
import { MenuItem } from './sidebar-menu-item';

declare const __DEV__: boolean;

const SidebarComponent: React.FC<RootComponentProps> = props => {
  const {
    uiEvents,
    plugins,
    worldConfig: { defaultApps, homepageApp },
  } = props;

  const [routeData, setRouteData] = React.useState(null);
  const [activeIntegrations, setActiveIntegrations] = React.useState(null);

  const { t } = useTranslation('ui-widget-sidebar');

  const currentLocation = useLocation();

  const loginQuery = useGetLogin();

  const loggedProfileQuery = useGetProfile(loginQuery.data?.pubKey);

  const routing = plugins['@akashaorg/app-routing']?.routing;

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
    routing?.navigateTo({
      appName,
      getNavigationUrl: () => route,
    });
  };

  const handleClickExplore = () => {
    routing?.navigateTo({
      appName: '@akashaorg/app-integration-center',
      getNavigationUrl: routes => routes.explore,
    });
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
    <Sidebar
      versionLabel={__DEV__ && 'DEV'}
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
      // size={size}
      loggedProfileData={loggedProfileQuery?.data}
      isLoggedIn={!!loginQuery.data.ethAddress}
      loadingUserInstalledApps={false}
      title={loggedProfileQuery?.data?.name ?? t('Guest')}
      subtitle={
        loggedProfileQuery?.data?.userName ?? t('Connect to see exclusive member only features.')
      }
      ctaText={t('Add magic to your world by installing cool apps developed by the community')}
      ctaButtonLabel={t('Check them out!')}
      footerLabel={t('Get in touch')}
      footerIcons={[
        { name: 'github', link: 'https://github.com/AKASHAorg' },
        { name: 'discord', link: '' },
        { name: 'telegram', link: 'https://t.me/worldofethereum' },
        { name: 'twitter', link: 'https://twitter.com/AKASHAworld' },
      ]}
      onBrandClick={handleBrandClick}
      onSidebarClose={handleSidebarClose}
      onClickMenuItem={handleNavigation}
      onClickExplore={handleClickExplore}
      /* Menu item will surely have the props,
          but typescript is not able to infer it
          because the cloneElement is used
        */
      menuItem={
        <MenuItem
          plugins={props.plugins}
          loginState={loginQuery?.data}
          {...({} as SidebarMenuItemProps)}
        />
      }
    />
  );
};

export default SidebarComponent;
