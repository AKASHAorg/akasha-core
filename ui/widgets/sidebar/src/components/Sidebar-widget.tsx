import DS from '@akashaproject/design-system';
import * as React from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { styled, Sidebar, useViewportSize } = DS;

const SidebarWidget: React.FC<RootComponentProps> = props => {
  return (
    <I18nextProvider i18n={props.plugins?.translation?.i18n}>
      <Router>
        <Menu
          navigateToUrl={props.singleSpa.navigateToUrl}
          getMenuItems={() => []}
          sidebarVisible={true}
        />
      </Router>
    </I18nextProvider>
  );
};

const AppSidebar = styled(Sidebar)`
  min-width: 15em;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    min-width: 13em;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.large.value}px) {
    max-width: 13em;
  }
`;

interface MenuProps {
  navigateToUrl: (url: string) => void;
  getMenuItems: () => IMenuItem[];
  sidebarVisible: boolean;
}

const Menu = (props: MenuProps) => {
  const { navigateToUrl } = props;

  const { t } = useTranslation('ui-widget-sidebar');

  const currentLocation = useLocation();

  const { size } = useViewportSize();

  const handleNavigation = (path: string) => {
    navigateToUrl(path);
  };

  const handleClickExplore = () => {
    /* */
  };

  return (
    <AppSidebar
      worldAppsTitleLabel={t('World Apps')}
      poweredByLabel="Powered by AKASHA"
      userInstalledAppsTitleLabel={t('Apps')}
      userInstalledApps={[]}
      exploreButtonLabel={t('Explore')}
      allMenuItems={[]}
      bodyMenuItems={[]}
      currentRoute={currentLocation.pathname}
      size={size}
      isLoggedIn={false}
      loadingUserInstalledApps={false}
      onClickMenuItem={handleNavigation}
      onClickExplore={handleClickExplore}
    />
  );
};

export default SidebarWidget;
