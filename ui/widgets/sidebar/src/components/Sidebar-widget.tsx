import DS from '@akashaproject/design-system';
import React, { PureComponent, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useLocation, BrowserRouter as Router } from 'react-router-dom';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { filter } from 'rxjs/operators';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const {
  responsiveBreakpoints,
  styled,
  lightTheme,
  ThemeSelector,
  Sidebar,
  ViewportSizeProvider,
  useViewportSize,
} = DS;

export default class SidebarWidget extends PureComponent<RootComponentProps> {
  public state: { hasErrors: boolean; errorMessage: string; showSidebar: boolean };
  public hideSidebarEvent = new CustomEvent('layout:hideSidebar');
  private subscription: any;
  constructor(props: RootComponentProps) {
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
                getMenuItems={() => []}
                uiEvents={this.props.uiEvents}
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
  uiEvents: any;
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
    <ThemeSelector
      availableThemes={[lightTheme]}
      settings={{ activeTheme: 'Light-Theme' }}
      style={{ height: '100%' }}
    >
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
    </ThemeSelector>
  );
};
