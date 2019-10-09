import { i18n as I18nType } from 'i18next';
import React, { PureComponent } from 'react';
// @ts-ignore
import SingleSpaReact from 'single-spa-react';
// import styled from 'styled-components';

export interface IProps {
  i18n: I18nType;
  sdkModules: any;
  singleSpa: any;
}

export default class LayoutWidget extends PureComponent<IProps> {
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
          Oh no, something went wrong in layout-widget
          <code>{this.state.errorMessage}</code>
        </div>
      );
    }
    return <div id="layout-root">Layouts....</div>;
  }
}
