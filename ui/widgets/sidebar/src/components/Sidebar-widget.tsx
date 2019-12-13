import DS from '@akashaproject/design-system';
import { i18n as I18nType } from 'i18next';
import React, { PureComponent, Suspense, SyntheticEvent } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
// @ts-ignore
import SingleSpaReact from 'single-spa-react';

const { Box, Grommet, lightTheme, TextIcon } = DS;
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
  const { t } = useTranslation();

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
      <Box pad={{ left: '2px' }}>
        <TextIcon
          iconType="home"
          label={`${t('Home')}`}
          onClick={handleNavigation('/')}
          clickable={true}
          menuIcon={true}
          menuActive={true}
        />
        {/* <p>Language</p>
      <MenuLink onClick={handleLangChange('en')}>{t('common:English')}</MenuLink>
      <MenuLink onClick={handleLangChange('ro')}>{t('common:Romanian')}</MenuLink> */}
      </Box>
    </Grommet>
  );
};
