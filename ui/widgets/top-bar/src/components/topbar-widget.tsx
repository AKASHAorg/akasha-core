import DS from '@akashaproject/design-system';
import { i18n as I18nType } from 'i18next';
import React, { PureComponent, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
// @ts-ignore
import SingleSpaReact from 'single-spa-react';
import { filter } from 'rxjs/operators';

const { lightTheme, Topbar, ThemeSelector } = DS;
export interface IProps {
  i18n: I18nType;
  sdkModules: any;
  globalChannel?: any;
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

export default class TopbarWidget extends PureComponent<IProps> {
  public state: { hasErrors: boolean; errorMessage: string; ethAddress: string };
  public showSidebarEvent = new CustomEvent('layout:showSidebar');
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

  componentDidMount() {
    this.subscription = this.props.globalChannel
      .pipe(filter((response: any) => response.channelInfo.method === 'signIn'))
      .subscribe((response: any) => this.setState({ ethAddress: response.data.ethAddress }));
  }
  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  public componentDidCatch(err: Error, info: React.ErrorInfo) {
    this.setState({
      hasErrors: true,
      errorMessage: `${err.message} :: ${info.componentStack}`,
    });
    // tslint:disable-next-line:no-console
    console.error(err, info);
  }

  public handleNavigation = (path: string) => {
    this.props.singleSpa.navigateToUrl(path);
  };

  // public showNotificationPopover = (ev: SyntheticEvent) => {
  //   /* tslint:disable-next-line:no-console */
  //   console.log('show notification popover');
  //   ev.preventDefault();
  // }
  // public showWalletPopover = (ev: SyntheticEvent) => {
  //   /* tslint:disable-next-line:no-console */
  //   console.log('show wallet popover');
  //   ev.preventDefault();
  // }
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
          <ThemeSelector availableThemes={[lightTheme]} settings={{ activeTheme: 'Light-Theme' }}>
            <Topbar
              avatarImage="https://placebeard.it/360x360"
              userName="john doe"
              brandLabel=""
              onNavigation={this.handleNavigation}
              onSidebarToggle={this.toggleSidebar}
              ethAddress={this.state.ethAddress}
            />
          </ThemeSelector>
        </Suspense>
      </I18nextProvider>
    );
  }
}
