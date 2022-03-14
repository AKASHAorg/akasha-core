import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { useGetLogin } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';

const { styled, Sidebar, useViewportSize } = DS;

const AppSidebar = styled(Sidebar)`
  margin-right: 0.8rem;
  min-width: 15em;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    min-width: 13em;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.large.value}px) {
    max-width: 17em;
  }
`;

const SidebarComponent: React.FC<RootComponentProps> = props => {
  const {
    singleSpa: { navigateToUrl },
  } = props;

  const [routeData, setRouteData] = React.useState({});

  const { t } = useTranslation('ui-widget-sidebar');

  const currentLocation = useLocation();

  const { size } = useViewportSize();

  const loginQuery = useGetLogin();

  React.useEffect(() => {
    const sub = props.plugins?.routing?.routeObserver?.subscribe({
      next: routeData => {
        setRouteData(routeData?.byArea);
      },
    });

    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const worldApps = routeData?.[MenuItemAreaType.AppArea];

  const handleNavigation = (path: string) => {
    navigateToUrl(path);
  };

  const handleClickExplore = () => {
    // find IC app from world apps
    // @TODO: replace string with a constant
    const icApp = worldApps.find(app => app.label === 'Integration Center');

    // if found, navigate to route
    if (icApp) {
      navigateToUrl(icApp.route);
    }
  };

  return (
    <AppSidebar
      worldAppsTitleLabel={t('World Apps')}
      poweredByLabel="Powered by AKASHA"
      userInstalledAppsTitleLabel={t('Apps')}
      userInstalledApps={[]}
      exploreButtonLabel={t('Explore')}
      allMenuItems={[]}
      worldApps={worldApps}
      currentRoute={currentLocation.pathname}
      size={size}
      isLoggedIn={!!loginQuery.data.ethAddress}
      loadingUserInstalledApps={false}
      onClickMenuItem={handleNavigation}
      onClickExplore={handleClickExplore}
    />
  );
};

export default SidebarComponent;
