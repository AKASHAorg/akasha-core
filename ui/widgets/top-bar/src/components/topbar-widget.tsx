import DS from '@akashaproject/design-system';
import React, { PureComponent, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import TopbarComponent from './topbar-component';
import { BrowserRouter as Router } from 'react-router-dom';

const { lightTheme, ThemeSelector } = DS;

export default class TopbarWidget extends PureComponent<RootComponentProps> {
  public state: {
    hasErrors: boolean;
    errorMessage: string;
  };
  public showSidebarEvent = new CustomEvent('layout:showSidebar');
  public hideSidebarEvent = new CustomEvent('layout:hideSidebar');

  private subscription: any;
  constructor(props: RootComponentProps) {
    super(props);
    this.state = {
      hasErrors: false,
      errorMessage: '',
    };
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
            <Router>
              <TopbarComponent getMenuItems={this.props.getMenuItems} {...this.props} />
            </Router>
          </ThemeSelector>
        </Suspense>
      </I18nextProvider>
    );
  }
}
