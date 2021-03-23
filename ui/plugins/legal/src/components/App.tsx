import React, { PureComponent } from 'react';
import DS from '@akashaproject/design-system';
import { I18nextProvider } from 'react-i18next';
import Routes from './routes';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';

const { ThemeSelector, lightTheme, darkTheme, Box } = DS;

/**
 * This is the entry point of a plugin.
 * Here you can add react-router, react-redux, etc..
 *
 * @todo Add more documentation for this component
 *
 * @warning :: Root component for a plugin should always extend React.Component
 * @warning :: Always use default export
 */

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

  public handleNavigation(href: string) {
    return (ev: React.SyntheticEvent) => {
      this.props.singleSpa.navigateToUrl(href);
      ev.preventDefault();
    };
  }
  public render() {
    const { i18n } = this.props;

    if (this.state.hasErrors) {
      return <div>Oh no, something went wrong in {'profile-plugin'}</div>;
    }

    return (
      <Box width="100vw">
        <React.Suspense fallback={<>Loading Legal</>}>
          <I18nextProvider i18n={i18n ? i18n : null}>
            <ThemeSelector
              availableThemes={[lightTheme, darkTheme]}
              settings={{ activeTheme: 'Light-Theme' }}
            >
              <Routes {...this.props} />
            </ThemeSelector>
          </I18nextProvider>
        </React.Suspense>
      </Box>
    );
  }
}

export default App;
