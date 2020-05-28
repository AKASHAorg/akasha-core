import DS from '@akashaproject/design-system';
import { i18n as I18nType } from 'i18next';
import React, { PureComponent, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useLocation, BrowserRouter as Router } from 'react-router-dom';
import {
  IMenuItem,
  EventTypes,
  MenuItemAreaType,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import { filter } from 'rxjs/operators';

const { lightTheme, ThemeSelector, ResponsiveSidebar, ViewportSizeProvider } = DS;
export interface IProps {
  i18n: I18nType;
  sdkModules: any;
  singleSpa: any;
  globalChannel: any;
  getMenuItems: () => any[];
  events: any;
  logger: any;
}

/**
 * This is the entry point of a plugin.
 * Here you can add react-router, react-redux, etc..
 *
 * @todo Add more documentation for this component
 *
 * @warning :: Root component for a plugin should always extend React.Component
 * @warning :: Always use default export
 */

export default class SidebarWidget extends PureComponent<IProps> {
  public state: { hasErrors: boolean; errorMessage: string; ethAddress: string };
  public hideSidebarEvent = new CustomEvent('layout:hideSidebar');
  private subscription: any;
  constructor(props: IProps) {
    super(props);
    this.state = {
      hasErrors: false,
      errorMessage: '',
      ethAddress: '0x0000000000000000000000000000000000000000',
    };
  }

  public componentDidCatch(err: Error, info: React.ErrorInfo) {
    this.setState({
      hasErrors: true,
      errorMessage: `${err.message} :: ${info.componentStack}`,
    });
    const { logger } = this.props;
    logger.error(err, info);
  }
  componentDidMount() {
    this.subscription = this.props.globalChannel
      .pipe(filter((response: any) => response.channelInfo.method === 'signIn'))
      .subscribe((response: any) => this.setState({ ethAddress: response.data.ethAddress }));
  }
  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  public handleCloseSidebar = () => {
    window.dispatchEvent(this.hideSidebarEvent);
  };

  public render() {
    if (this.state.hasErrors) {
      return (
        <div>
          Oh no, something went wrong in sidebar-widget
          <div>
            <code>{this.state.errorMessage}</code>
          </div>
        </div>
      );
    }
    return (
      <Router>
        <I18nextProvider i18n={this.props.i18n}>
          <Suspense fallback={<>...</>}>
            <Menu
              navigateToUrl={this.props.singleSpa.navigateToUrl}
              getMenuItems={this.props.getMenuItems}
              loaderEvents={this.props.events}
              handleCloseSidebar={this.handleCloseSidebar}
              ethAddress={this.state.ethAddress}
            />
          </Suspense>
        </I18nextProvider>
      </Router>
    );
  }
}

interface MenuProps {
  navigateToUrl: (url: string) => void;
  getMenuItems: () => IMenuItem[];
  loaderEvents: any;
  ethAddress: string;
  handleCloseSidebar: () => void;
}

const Menu = (props: MenuProps) => {
  const { navigateToUrl, getMenuItems, loaderEvents, handleCloseSidebar, ethAddress } = props;

  const currentLocation = useLocation();

  const [currentMenu, setCurrentMenu] = React.useState<IMenuItem[]>([]);

  React.useEffect(() => {
    const updateMenu = () => {
      const menuItems = getMenuItems();
      setCurrentMenu(menuItems);
    };
    updateMenu();
    loaderEvents.subscribe((evMsg: EventTypes) => {
      if (evMsg === EventTypes.AppInstall || evMsg === EventTypes.PluginInstall) {
        updateMenu();
      }
    });
    return function cleanup() {
      loaderEvents.unsubscribe();
    };
  }, []);

  // *how to obtain different sidebar menu sections8
  const header = currentMenu?.filter(
    menuItem => menuItem.area === MenuItemAreaType.QuickAccessArea,
  );
  const body = currentMenu?.filter(menuItem => menuItem.area === MenuItemAreaType.AppArea);
  const footer = currentMenu?.filter(menuItem => menuItem.area === MenuItemAreaType.BottomArea);

  const handleNavigation = (path: string) => {
    navigateToUrl(path);
  };

  return (
    <ThemeSelector
      availableThemes={[lightTheme]}
      settings={{ activeTheme: 'Light-Theme' }}
      style={{
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      <ViewportSizeProvider>
        <ResponsiveSidebar
          loggedEthAddress={ethAddress}
          onClickCloseSidebar={handleCloseSidebar}
          onClickMenuItem={handleNavigation}
          allMenuItems={currentMenu}
          headerMenuItems={header}
          bodyMenuItems={body}
          footerMenuItems={footer}
          currentRoute={currentLocation.pathname}
        />
      </ViewportSizeProvider>
    </ThemeSelector>
  );
};
