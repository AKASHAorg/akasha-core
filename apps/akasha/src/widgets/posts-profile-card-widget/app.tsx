import * as React from 'react';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { I18nextProvider } from 'react-i18next';
import DS from '@akashaproject/design-system';
import ProfileCardWidget from './profile-card-widget';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import routes, { POST } from '../../routes';

const { ThemeSelector, lightTheme, darkTheme, ErrorInfoCard, ErrorLoader } = DS;

class Widget extends React.Component<RootComponentProps> {
  public state: { errors: any } = {
    errors: {},
  };
  public componentDidCatch(error: Error, errorInfo: any) {
    if (this.props.logger) {
      this.props.logger.error('posts-profile-widget error %j %j', error, errorInfo);
    }
    // just replace the state since we treat any error caught here
    // as critical one
    this.setState({
      errors: {
        'caught.critical': {
          error: error,
          componentStack: errorInfo.componentStack,
          critical: true,
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
            <Router>
              <ErrorInfoCard errors={this.state.errors}>
                {(messages, isCritical) => {
                  return (
                    <>
                      {messages && (
                        <ErrorLoader
                          type="script-error"
                          title={'Widget error'}
                          details={'Cannot load Profile card widget'}
                          devDetails={messages}
                        />
                      )}
                      {!isCritical && (
                        <Route path={`${routes[POST]}/:postId`}>
                          <ProfileCardWidget {...this.props} />
                        </Route>
                      )}
                    </>
                  );
                }}
              </ErrorInfoCard>
            </Router>
          </ThemeSelector>
        </React.Suspense>
      </I18nextProvider>
    );
  }
}

export default Widget;
