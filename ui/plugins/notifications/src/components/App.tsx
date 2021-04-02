import React, { PureComponent } from 'react';
import DS from '@akashaproject/design-system';
import { I18nextProvider } from 'react-i18next';
import NotificationsPage from './notifications-page';

const { Box, lightTheme, ThemeSelector, ViewportSizeProvider } = DS;

export interface IProps {
  singleSpa: any;
  activeWhen: {
    path: string;
  };

  mountParcel: (config: any, props: any) => void;
  rootNodeId: string;
  sdkModules: any;
  globalChannel: any;
  logger: any;
  i18n?: any;
  rxjsOperators: any;
}

class App extends PureComponent<IProps> {
  public state: { hasErrors: boolean };

  constructor(props: IProps) {
    super(props);
    this.state = {
      hasErrors: false,
    };
  }

  public componentDidCatch(err: Error, info: React.ErrorInfo) {
    this.setState({
      hasErrors: true,
    });
    const { logger } = this.props;
    logger.error(err, info);
  }
  public render() {
    const { i18n } = this.props;

    if (this.state.hasErrors) {
      return <div>Oh no, something went wrong in {'notifications-plugin'}</div>;
    }

    return (
      <Box width="100vw">
        <React.Suspense fallback={<>Loading</>}>
          <ThemeSelector availableThemes={[lightTheme]} settings={{ activeTheme: 'Light-Theme' }}>
            <I18nextProvider i18n={i18n ? i18n : null}>
              <ViewportSizeProvider>
                <NotificationsPage
                  logger={this.props.logger}
                  sdkModules={this.props.sdkModules}
                  singleSpa={this.props.singleSpa}
                  globalChannel={this.props.globalChannel}
                  rxjsOperators={this.props.rxjsOperators}
                />
              </ViewportSizeProvider>
            </I18nextProvider>
          </ThemeSelector>
        </React.Suspense>
      </Box>
    );
  }
}

export default App;
