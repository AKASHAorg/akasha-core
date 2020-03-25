import DS from '@akashaproject/design-system';
import { i18n as I18nType } from 'i18next';
import React, { PureComponent, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';

const { Box, lightTheme, Icon, styled, ThemeSelector } = DS;
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

export default class SidebarWidget extends PureComponent<IProps> {
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
          <Menu navigateToUrl={this.props.singleSpa.navigateToUrl} />
        </Suspense>
      </I18nextProvider>
    );
  }
}

interface MenuProps {
  navigateToUrl: (url: string) => void;
}

const Menu = (props: MenuProps) => {
  const { navigateToUrl } = props;
  // const { t } = useTranslation();

  const handleNavigation = (path: string) => (/* ev: SyntheticEvent */) => {
    navigateToUrl(path);
  };

  return (
    <ThemeSelector
      availableThemes={[lightTheme]}
      settings={{ activeTheme: 'Light-Theme' }}
      style={{
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      <SidebarWrapper>
        <Box pad={{ left: '2px' }} style={{ justifyContent: 'space-between', height: '100%' }}>
          <Icon type="home" onClick={handleNavigation('/')} />
        </Box>
      </SidebarWrapper>
    </ThemeSelector>
  );
};

const SidebarWrapper = styled.div`
  height: 100%;
  background: ${props => props.theme.colors.lightBackground};
  padding: 0.75em 0;
`;
