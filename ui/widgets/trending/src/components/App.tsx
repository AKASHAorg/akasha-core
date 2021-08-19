import React, { PureComponent } from 'react';
import { I18nextProvider } from 'react-i18next';
import TrendingWidgetComponent from './trending-widget-component';
import i18next from '../i18n';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ReactQueryDevtools } from 'react-query/devtools';

export default class TrendingWidgetRoot extends PureComponent<RootComponentProps> {
  public state: {
    hasErrors: boolean;
    errorMessage: string;
  };
  constructor(props: RootComponentProps) {
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
  // componentDidMount() {
  //   if (this.props.i18n) {
  //     this.props.i18n.loadNamespaces('ui-widget-trending');
  //   }
  // }
  public render() {
    const { logger } = this.props;

    if (this.state.hasErrors) {
      return (
        <div>
          Oh no, something went wrong in trending-widget
          <div>
            <code>{this.state.errorMessage}</code>
          </div>
        </div>
      );
    }

    return (
      <React.Suspense fallback={<></>}>
        <I18nextProvider i18n={i18next} defaultNS="ui-widget-trending">
          <TrendingWidgetComponent {...this.props} />
        </I18nextProvider>
        <ReactQueryDevtools position={'bottom-right'} />
      </React.Suspense>
    );
  }
}
