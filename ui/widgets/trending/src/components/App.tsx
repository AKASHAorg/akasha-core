import React from 'react';
import { I18nextProvider } from 'react-i18next';
import TrendingWidgetComponent from './trending-widget-component';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ReactQueryDevtools } from 'react-query/devtools';

const TrendingWidgetRoot: React.FC<RootComponentProps> = props => {
  return (
    <>
      <I18nextProvider i18n={props.plugins?.translation?.i18n} defaultNS="ui-widget-trending">
        <TrendingWidgetComponent {...props} />
      </I18nextProvider>
      <ReactQueryDevtools position={'bottom-right'} />
    </>
  );
};

export default TrendingWidgetRoot;
