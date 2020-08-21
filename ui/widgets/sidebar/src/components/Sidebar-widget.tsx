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

const {
  responsiveBreakpoints,
  styled,
  lightTheme,
  ThemeSelector,
  Sidebar,
  ViewportSizeProvider,
  useViewportSize,
} = DS;
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
  public state: { hasErrors: boolean; errorMessage: string; showSidebar: boolean };
  public hideSidebarEvent = new CustomEvent('layout:hideSidebar');
  private subscription: any;
  constructor(props: IProps) {
    super(props);
    this.state = {
      hasErrors: false,
      errorMessage: '',
      showSidebar: false,
    };
  }

  public componentDidCatch(err: Error, info: React.ErrorInfo) {
    this.setState({
      hasErrors: true,
      errorMessage: `${err.message} :: ${info.componentStack}`,
    });
    const { logger } = this.props;
    logger.error('an error has occurred %j %j', err, info);
  }
  componentDidMount() {
    this.subscription = this.props.globalChannel
      .pipe(filter((response: any) => response.channelInfo.method === 'signIn'))
      .subscribe((response: any) => this.setState({ ethAddress: response.data.ethAddress }));

    window.addEventListener('layout:showSidebar', this.showSidebar);
    window.addEventListener('layout:hideSidebar', this.hideSidebar);
  }
  componentWillUnmount() {
    this.subscription.unsubscribe();
    window.removeEventListener('layout:showSidebar', this.showSidebar);
    window.removeEventListener('layout:hideSidebar', this.hideSidebar);
  }

  public showSidebar = () => {
    this.setState({ showSidebar: true });
  };

  public hideSidebar = () => {
    this.setState({ showSidebar: false });
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
            <ViewportSizeProvider>
              <Menu
                navigateToUrl={this.props.singleSpa.navigateToUrl}
                getMenuItems={this.props.getMenuItems}
                loaderEvents={this.props.events}
                sidebarVisible={this.state.showSidebar}
              />
            </ViewportSizeProvider>
          </Suspense>
        </I18nextProvider>
      </Router>
    );
  }
}
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
  loaderEvents: any;
  sidebarVisible: boolean;
}

const Menu = (props: MenuProps) => {
  const { navigateToUrl, getMenuItems, loaderEvents, sidebarVisible } = props;

  const currentLocation = useLocation();

  const { size } = useViewportSize();

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

  // *how to obtain different sidebar menu sections
  const body = currentMenu?.filter(menuItem => menuItem.area === MenuItemAreaType.AppArea);
  const footer = currentMenu?.filter(menuItem => menuItem.area === MenuItemAreaType.BottomArea);

  const handleNavigation = (path: string) => {
    navigateToUrl(path);
  };

  return (
    <ThemeSelector
      availableThemes={[lightTheme]}
      settings={{ activeTheme: 'Light-Theme' }}
      style={{ height: '100%' }}
    >
      {sidebarVisible && (
        <AppSidebar
          onClickMenuItem={handleNavigation}
          allMenuItems={currentMenu}
          bodyMenuItems={body}
          footerMenuItems={footer}
          currentRoute={currentLocation.pathname}
          size={size}
        />
      )}
    </ThemeSelector>
  );
};
