import { i18n as I18nType } from 'i18next';
import React, { PureComponent, SyntheticEvent } from 'react';
import { I18nextProvider } from 'react-i18next';
// @ts-ignore
import styled from 'styled-components';

export interface IProps {
  i18n: I18nType;
  sdkModules: any;
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

const SidebarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 64px;
  box-shadow: 0 0 2px 1px #dadada;
  background-color: #0588e6;
`;

export default class SidebarWidget extends PureComponent<IProps> {
  public state: { hasErrors: boolean };

  constructor(props: IProps) {
    super(props);
    this.state = {
      hasErrors: false,
    };
  }

  public componentDidCatch(err: Error, info: React.ErrorInfo) {
    this.setState({
      hasErrors: true,
    });
    // tslint:disable-next-line:no-console
    console.error(err, info);
  }
  public handleLangChange(lang: string) {
    return (ev: SyntheticEvent) => {
      const evt = new CustomEvent('change-language', {
        detail: lang,
      });
      document.dispatchEvent(evt);
      ev.preventDefault();
    };
  }
  public render() {
    if (this.state.hasErrors) {
      return <div>Oh no, something went wrong in sidebar-widget</div>;
    }
    return (
      <I18nextProvider i18n={this.props.i18n}>
        <SidebarWrapper>
          <div onClick={this.handleLangChange('en')}>EN</div>
          <div onClick={this.handleLangChange('ro')}>RO</div>
        </SidebarWrapper>
      </I18nextProvider>
    );
  }
}
