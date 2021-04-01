import React, { PureComponent } from 'react';
import DS from '@akashaproject/design-system';
import { I18nextProvider } from 'react-i18next';
import Routes from './routes';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';

const { Box, lightTheme, ThemeSelector, ViewportSizeProvider, Helmet } = DS;

class App extends PureComponent<RootComponentProps> {
  public state: { hasErrors: boolean };

  constructor(props: RootComponentProps) {
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
      return <div>Oh no, something went wrong in {'search-plugin'}</div>;
    }

    return (
      <Box width="100vw">
        <React.Suspense fallback={<>Loading</>}>
          <ThemeSelector availableThemes={[lightTheme]} settings={{ activeTheme: 'Light-Theme' }}>
            <I18nextProvider i18n={i18n ? i18n : null}>
              <Helmet>
                <title>Search | Ethereum World</title>
              </Helmet>
              <ViewportSizeProvider>
                <Routes {...this.props} />
              </ViewportSizeProvider>
            </I18nextProvider>
          </ThemeSelector>
        </React.Suspense>
      </Box>
    );
  }
}

export default App;
