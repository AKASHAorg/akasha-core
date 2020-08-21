import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { I18nextProvider } from 'react-i18next';
import * as React from 'react';
import WohooWidget from './wohoo-widget';

const { ThemeSelector, ErrorLoader, lightTheme, darkTheme, ErrorInfoCard } = DS;

class Widget extends React.Component<RootComponentProps> {
  public state: { errors: any } = {
    errors: {},
  };
  public componentDidCatch(error: Error, errorInfo: any) {
    if (this.props.logger) {
      this.props.logger.error('auth-widget error %j %j', error, errorInfo);
    }
    // just replace the state since we treat any error caught here
    // as critical one
    this.setState({
      errors: {
        'caught.critical': {
          error: new Error(`${error} \n Additional info: \n ${errorInfo}`),
          critical: false,
        },
      },
    });
  }

  render() {
    return (
      <I18nextProvider i18n={this.props.i18n}>
        <React.Suspense fallback={<>...</>}>
          <ThemeSelector
            settings={{ activeTheme: 'Light-Theme' }}
            availableThemes={[lightTheme, darkTheme]}
            style={{ height: '100%' }}
            plain={true}
          >
            <ErrorInfoCard errors={this.state.errors}>
              {(messages, isCritical) => (
                <>
                  {messages && (
                    <ErrorLoader type="script-error" title={'Errors:'} details={<>{messages}</>} />
                  )}
                  {!isCritical && <WohooWidget {...this.props} />}
                </>
              )}
            </ErrorInfoCard>
          </ThemeSelector>
        </React.Suspense>
      </I18nextProvider>
    );
  }
}

export default Widget;
