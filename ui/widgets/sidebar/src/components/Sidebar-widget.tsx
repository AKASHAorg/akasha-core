import DS from '@akashaproject/design-system';
import { IMenuItem } from '@akashaproject/design-system/src/components/Bars/sidebar/sidebar';
import { i18n as I18nType } from 'i18next';
import React, { PureComponent, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';

const { lightTheme, ThemeSelector, ResponsiveSidebar } = DS;
export interface IProps {
  i18n: I18nType;
  sdkModules: any;
  singleSpa: any;
  getMenuItems: () => any[];
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
  public state: { hasErrors: boolean; errorMessage: string };

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
    // tslint:disable-next-line:no-console
    console.error(err, info);
  }

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
      <I18nextProvider i18n={this.props.i18n}>
        <Suspense fallback={<>...</>}>
          <Menu
            navigateToUrl={this.props.singleSpa.navigateToUrl}
            getMenuItems={this.props.getMenuItems}
          />
        </Suspense>
      </I18nextProvider>
    );
  }
}

interface MenuProps {
  navigateToUrl: (url: string) => void;
  getMenuItems: () => IMenuItem[];
}

const Menu = (props: MenuProps) => {
  const { navigateToUrl, getMenuItems } = props;

  const [currentMenu, setCurrentMenu] = React.useState<IMenuItem[] | null>(null);
  // const { t } = useTranslation();
  React.useEffect(() => {
    const menuItems = getMenuItems();
    setCurrentMenu(menuItems);
  }, []);

  // filter out default plugins like profile and feed
  const installedApps = currentMenu?.filter(menuItem => menuItem.type === 'app');

  // return the plugins from list of apps
  const profileDefaultData = currentMenu?.find(menuItem => menuItem.index === 2);
  const feedDefaultData = currentMenu?.find(menuItem => menuItem.index === 1);

  const handleNavigation = (path: string) => {
    navigateToUrl(path);
  };

  const handleClickAddApp = () => {
    return;
  };

  const handleClickSearch = () => {
    return;
  };

  const handleCloseSidebar = () => {
    return;
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
      <ResponsiveSidebar
        loggedEthAddress={'0x000000000000000000000'}
        onClickAddApp={handleClickAddApp}
        onClickCloseSidebar={handleCloseSidebar}
        onClickSearch={handleClickSearch}
        searchLabel={'Search'}
        appCenterLabel={'App Center'}
        onClickMenuItem={handleNavigation}
        installedApps={installedApps}
        feedPluginData={feedDefaultData}
        profilePluginData={profileDefaultData}
      />
    </ThemeSelector>
  );
};
