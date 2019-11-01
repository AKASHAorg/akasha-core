import { Grommet, Icon, IconLink, lightTheme, styled } from '@akashaproject/design-system';
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

const MenuLink = styled(IconLink)`
  padding: 0 1em;
  margin-left: ${props => props.theme.spacing.margin.base};
  border-left: 2px solid ${props => props.theme.colors.blue};
  border-radius: 0;
`;

const Menu = (props: MenuProps) => {
  const { navigateToUrl } = props;
  const [t] = useTranslation();

  // const handleLangChange = (lang: string) => (ev: SyntheticEvent) => {
  //   const evt = new CustomEvent('change-language', {
  //     detail: lang,
  //   });
  //   document.dispatchEvent(evt);
  //   ev.preventDefault();
  // };

  const handleNavigation = (path: string) => (ev: SyntheticEvent) => {
    navigateToUrl(path);
    ev.preventDefault();
  };

  return (
    <Grommet theme={lightTheme}>
      <MenuLink
        icon={<Icon type="home" />}
        label={`${t('Home')}`}
        onClick={handleNavigation('/')}
      />
      {/* <p>Language</p>
      <MenuLink onClick={handleLangChange('en')}>{t('common:English')}</MenuLink>
      <MenuLink onClick={handleLangChange('ro')}>{t('common:Romanian')}</MenuLink> */}
    </Grommet>
  );
};
