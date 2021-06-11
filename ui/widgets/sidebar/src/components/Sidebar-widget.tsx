import DS from '@akashaproject/design-system';
import React, { PureComponent, Suspense } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { useLocation, BrowserRouter as Router } from 'react-router-dom';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { filter } from 'rxjs/operators';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import Fetch from 'i18next-fetch-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';

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
    const { logger } = this.props;
    i18next
      .use(initReactI18next)
      .use(Backend)
      .use(LanguageDetector)
      .use({
        type: 'logger',
        log: logger.info,
        warn: logger.warn,
        error: logger.error,
      })
      .init({
        fallbackLng: 'en',
        ns: ['sidebar'],
        saveMissing: false,
        saveMissingTo: 'all',
        load: 'languageOnly',
        debug: true,
        cleanCode: true,
        keySeparator: false,
        defaultNS: 'sidebar',
        backend: {
          backends: [LocalStorageBackend, Fetch],
          backendOptions: [
            {
              prefix: 'i18next_res_v0',
              expirationTime: 24 * 60 * 60 * 1000,
            },
            {
              loadPath: '/locales/{{lng}}/{{ns}}.json',
            },
          ],
        },
      });
    return (
      <Router>
        <I18nextProvider i18n={i18next}>
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
