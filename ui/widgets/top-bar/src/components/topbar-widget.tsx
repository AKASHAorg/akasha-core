import DS from '@akashaproject/design-system';
import React, { PureComponent, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
// @ts-ignore
import SingleSpaReact from 'single-spa-react';
import { filter } from 'rxjs/operators';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import TopbarComponent from './topbar-component';

const { lightTheme, ThemeSelector, ViewportSizeProvider } = DS;

/**
 * This is the entry point of a plugin.
 * Here you can add react-router, react-redux, etc..
 *
 * @todo Add more documentation for this component
 *
 * @warning :: Root component for a plugin should always extend React.Component
 * @warning :: Always use default export
 */

export default class TopbarWidget extends PureComponent<RootComponentProps> {
  public state: {
    hasErrors: boolean;
    errorMessage: string;
    ethAddress: string | null;
    token: string | null;
  };
  public showSidebarEvent = new CustomEvent('layout:showSidebar');
  public hideSidebarEvent = new CustomEvent('layout:hideSidebar');

  private subscription: any;
  constructor(props: RootComponentProps) {
    super(props);
    this.state = {
      hasErrors: false,
      errorMessage: '',
      // logged eth address
      ethAddress: null,
      token: null,
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
  public handleLogin = (provider: 2 | 3) => {
    const call = this.props.sdkModules.auth.authService.signIn(provider);
    call.subscribe(
      (res: any) => {
        const { ethAddress, token } = res.data;
        this.setState({
          ethAddress,
          token,
        });
      },
      (err: Error) => {
        this.props.logger.error(err);
        // @TODO: do something with this error
      },
    );
  };
  public handleGlobalLogin = (ethAddr: string, token: string) => {
    this.setState({
      token,
      ethAddress: ethAddr,
    });
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
                ethAddress={this.state.ethAddress}
                loaderEvents={this.props.events}
                modalSlotId={this.props.layout.modalSlotId}
                onLogin={this.handleLogin}
                onGlobalLogin={this.handleGlobalLogin}
                globalChannel={this.props.globalChannel}
                logger={this.props.logger}
              />
            </ViewportSizeProvider>
          </ThemeSelector>
        </Suspense>
      </I18nextProvider>
    );
  }
}
