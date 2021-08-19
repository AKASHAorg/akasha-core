import React, { PureComponent, Suspense } from 'react';
import DS from '@akashaproject/design-system';
import WidgetErrorCard from './widget-error-card';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import LoginWidget from './login-cta-widget';
import i18next from '../i18n';

const { ThemeSelector, lightTheme, darkTheme } = DS;

export interface ILoginCTAWidgetProps {
  logger: any;
  i18n: any;
  layout: any;
}

export default class LoginCTAWidgetRoot extends PureComponent<ILoginCTAWidgetProps> {
  public state: { errors: any } = {
    errors: {},
  };
  public componentDidCatch(error: Error, errorInfo: any) {
    if (this.props.logger) {
      this.props.logger.error('auth-widget error %j %j', error, errorInfo);
    }
    this.setState({
      errors: {
        'caught.critical': {
          error: new Error(`${error} \n Additional info: \n ${errorInfo}`),
          critical: false,
        },
      },
    });
  }

  public render() {
    return (
      <I18nextProvider i18n={i18next}>
        <Suspense fallback={<>...</>}>
          <ThemeSelector
            settings={{ activeTheme: 'Light-Theme' }}
            availableThemes={[lightTheme, darkTheme]}
            style={{ height: '100%' }}
            plain={true}
          >
            <WidgetErrorCard errors={this.state.errors}>
              <LoginWidget />
            </WidgetErrorCard>
          </ThemeSelector>
        </Suspense>
      </I18nextProvider>
    );
  }
}
