import React, { PureComponent } from 'react';
import DS from '@akashaproject/design-system';
import { I18nextProvider } from 'react-i18next';
import Routes from './routes';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/lib';
import i18next from '../i18n';

const { Box } = DS;

/**
 * This is the entry point of a plugin.
 * Here you can add react-router, react-redux, etc..
 *
 * TODO: Add more documentation for this component
 *
 * warning :: Always use default export
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
    if (this.state.hasErrors) {
      return <div>Oh no, something went wrong in {'profile-plugin'}</div>;
    }

    return (
      <Box width="100vw">
        <I18nextProvider i18n={i18next}>
          <Routes {...this.props} />
        </I18nextProvider>
      </Box>
    );
  }
}

export default App;
