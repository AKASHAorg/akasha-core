import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
// import { ReactQueryDevtools } from 'react-query/devtools';
import TrendingWidgetComponent from './trending-widget-component';

const TrendingWidgetRoot: React.FC<RootComponentProps> = props => {
  return (
    <>
      <I18nextProvider
        i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}
        defaultNS="ui-widget-trending"
      >
        <TrendingWidgetComponent {...props} />
      </I18nextProvider>
      {/*<ReactQueryDevtools position={'bottom-right'} />*/}
    </>
  );
};

export default TrendingWidgetRoot;
