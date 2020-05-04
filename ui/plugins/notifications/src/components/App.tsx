import React, { PureComponent } from 'react';
import DS from '@akashaproject/design-system';
import { I18nextProvider } from 'react-i18next';

export interface IProps {
  singleSpa: any;
  activeWhen: {
    path: string;
  };

  mountParcel: (config: any, props: any) => void;
  rootNodeId: string;
  sdkModules: any;
  logger: any;
  i18n?: any;
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
      <I18nextProvider i18n={i18n ? i18n : null}>
        <DS.Helmet>
          <title>Notifications</title>
        </DS.Helmet>
        <h1>Notifications plugin</h1>
      </I18nextProvider>
    );
  }
}

export default App;
