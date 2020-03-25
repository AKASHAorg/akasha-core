import DS from '@akashaproject/design-system';
import { i18n as I18nType } from 'i18next';
import React, { PureComponent, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';

const { lightTheme, ThemeSelector, ResponsiveSidebar } = DS;
export interface IProps {
  i18n: I18nType;
  sdkModules: any;
  singleSpa: any;
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
    console.log(this.props);
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
          <Menu navigateToUrl={this.props.singleSpa.navigateToUrl} />
        </Suspense>
      </I18nextProvider>
    );
  }
}

interface MenuProps {
  navigateToUrl: (url: string) => void;
}

const Menu = (props: MenuProps) => {
  const { navigateToUrl } = props;
  // const { t } = useTranslation();

  const handleNavigation = (path: { appName: string; appSubroute: string }) => {
    navigateToUrl(`/${path.appName}/${path.appSubroute}`);
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
        ethAddress={'0x000000000000000000000'}
        onClickAddApp={handleClickAddApp}
        onClickCloseSidebar={handleCloseSidebar}
        onClickSearch={handleClickSearch}
        searchLabel={'Search'}
        appCenterLabel={'App Center'}
        onClickOption={handleNavigation}
        installedApps={[
          {
            name: '3Box',
            ethAddress: '0x003410490050000327496570034567114572111',
            image: 'https://pbs.twimg.com/profile_images/1125210143484985344/6Kae1Al3_400x400.png',
            options: ['Discover', 'About', 'Settings', 'Notifications', 'Feed'],
          },
          {
            name: 'ENS',
            ethAddress: '0x003410490050000327496570034567114572231',
            image: 'https://pbs.twimg.com/profile_images/1011937615619215360/r64kbrPi_400x400.jpg',
            options: ['About', 'Settings', 'Notifications'],
          },
        ]}
      />
    </ThemeSelector>
  );
};
