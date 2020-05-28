import DS from '@akashaproject/design-system';
import { i18n as I18nType } from 'i18next';
import React, { PureComponent, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
// @ts-ignore
import SingleSpaReact from 'single-spa-react';
import {
  IMenuItem,
  EventTypes,
  MenuItemAreaType,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

const { lightTheme, Topbar, ThemeSelector, ViewportSizeProvider, useViewportSize } = DS;
export interface IProps {
  i18n: I18nType;
  sdkModules: any;
  singleSpa: any;
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

export default class TopbarWidget extends PureComponent<IProps> {
  public state: { hasErrors: boolean; errorMessage: string };
  public showSidebarEvent = new CustomEvent('layout:showSidebar');
  public hideSidebarEvent = new CustomEvent('layout:hideSidebar');

  constructor(props: IProps) {
    super(props);
    this.state = {
      hasErrors: false,
      errorMessage: '',
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

  public toggleSidebar = (visible: boolean) => {
    if (visible) {
      window.dispatchEvent(this.showSidebarEvent);
    } else {
      window.dispatchEvent(this.hideSidebarEvent);
    }
  };

  public render() {
    if (this.state.hasErrors) {
      return (
        <div>
          Oh no, something went wrong in topbar-widget
          <div>
            <code>{this.state.errorMessage}</code>
          </div>
        </div>
      );
    }
    return (
      <I18nextProvider i18n={this.props.i18n}>
        <Suspense fallback={<>...</>}>
          <ThemeSelector availableThemes={[lightTheme]} settings={{ activeTheme: 'Light-Theme' }}>
            <ViewportSizeProvider>
              <TopbarComponent
                navigateToUrl={this.props.singleSpa.navigateToUrl}
                toggleSidebar={this.toggleSidebar}
                getMenuItems={this.props.getMenuItems}
                loaderEvents={this.props.events}
              />
            </ViewportSizeProvider>
          </ThemeSelector>
        </Suspense>
      </I18nextProvider>
    );
  }
}

interface TopBarProps {
  navigateToUrl: (url: string) => void;
  toggleSidebar: (visible: boolean) => void;
  getMenuItems: () => IMenuItem[];
  loaderEvents: any;
}

const TopbarComponent = (props: TopBarProps) => {
  const { navigateToUrl, getMenuItems, loaderEvents, toggleSidebar } = props;

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

  // *how to obtain different topbar menu sections
  const quickAccessItems = currentMenu?.filter(
    menuItem => menuItem.area === MenuItemAreaType.QuickAccessArea,
  );
  const searchAreaItem = currentMenu?.filter(
    menuItem => menuItem.area === MenuItemAreaType.SearchArea,
  )[0];

  const handleNavigation = (path: string) => {
    navigateToUrl(path);
  };

  const handleSearchBarKeyDown = (
    ev: React.KeyboardEvent<HTMLInputElement>,
    inputValue: string,
  ) => {
    if (ev.key === 'Enter' && searchAreaItem) {
      handleNavigation(`${searchAreaItem.route}/${inputValue}`);
    }
  };

  const { size } = useViewportSize();

  return (
    <ThemeSelector availableThemes={[lightTheme]} settings={{ activeTheme: 'Light-Theme' }}>
      <Topbar
        avatarImage="https://placebeard.it/360x360"
        brandLabel="Ethereum World"
        onNavigation={handleNavigation}
        onSearch={handleSearchBarKeyDown}
        onSidebarToggle={toggleSidebar}
        ethAddress="0x1ad35f55220234DF32A"
        quickAccessItems={quickAccessItems}
        searchAreaItem={searchAreaItem}
        size={size}
      />
    </ThemeSelector>
  );
};
