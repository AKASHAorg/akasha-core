import React, { PureComponent } from 'react';
import { I18nextProvider } from 'react-i18next';
import MyBoxProfile from './profile';

export default class App extends PureComponent<any> {
  public render() {
    const { i18n, sdkModules, channelUtils } = this.props;

    return (
      <I18nextProvider i18n={i18n ? i18n : null}>
        <MyBoxProfile sdkModules={sdkModules} channelUtils={channelUtils} />
      </I18nextProvider>
    );
  }
}
