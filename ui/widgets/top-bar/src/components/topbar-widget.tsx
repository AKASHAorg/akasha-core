import { IconLink, Icon, Grommet, grommet, lightTheme } from '@akashaproject/design-system';
import { i18n as I18nType } from 'i18next';
import React, { PureComponent, Suspense, SyntheticEvent } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
// @ts-ignore
import SingleSpaReact from 'single-spa-react';

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

export default class TopbarWidget extends PureComponent<IProps> {
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
          <Grommet theme={lightTheme}>
            <div>
              <div>Ethereum.world</div>
              <div>
                <IconLink
                  icon={<Icon type="notifications" />}
                  label=""
                  onClick={() => {}}
                  size="medium"
                />
                <div>Wallet</div>
                <div>My Profile</div>
              </div>
            </div>
          </Grommet>
        </Suspense>
      </I18nextProvider>
    );
  }
}
