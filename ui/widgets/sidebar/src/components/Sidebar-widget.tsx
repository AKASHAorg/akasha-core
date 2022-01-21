import DS from '@akashaproject/design-system';
import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import i18next from '../i18n';

const { responsiveBreakpoints, styled, Sidebar, useViewportSize } = DS;

const SidebarWidget: React.FC<RootComponentProps> = props => {
  return (
    <Router>
      <I18nextProvider i18n={i18next}>
        <Menu
          navigateToUrl={props.singleSpa.navigateToUrl}
          getMenuItems={() => []}
          sidebarVisible={true}
        />
      </I18nextProvider>
    </Router>
  );
};

const { breakpoints } = responsiveBreakpoints.global;

const AppSidebar = styled(Sidebar)`
  min-width: 15em;
  @media screen and (min-width: ${breakpoints.medium.value}px) {
    min-width: 13em;
  }
  @media screen and (min-width: ${breakpoints.large.value}px) {
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

  const currentLocation = useLocation();

  const { size } = useViewportSize();

  const handleNavigation = (path: string) => {
    navigateToUrl(path);
  };

  return (
    <AppSidebar
      onClickMenuItem={handleNavigation}
      allMenuItems={[]}
      bodyMenuItems={[]}
      footerMenuItems={[
        {
          name: 'App center',
          index: 0,
          label: 'Integration Center',
          route: '/app-center',
          subRoutes: [],
        },
      ]}
      currentRoute={currentLocation.pathname}
      size={size}
    />
  );
};

export default SidebarWidget;
