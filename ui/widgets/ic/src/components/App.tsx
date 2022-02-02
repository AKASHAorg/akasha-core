import React from 'react';
import { I18nextProvider } from 'react-i18next';
import ICWidgetComponent from './ic-widget-component';
import i18next from '../i18n';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ReactQueryDevtools } from 'react-query/devtools';

const TrendingWidgetRoot: React.FC<RootComponentProps> = props => {
  return (
    <>
      <I18nextProvider i18n={i18next} defaultNS="ui-widget-ic">
        <ICWidgetComponent {...props} />
      </I18nextProvider>
      <ReactQueryDevtools position={'bottom-right'} />
    </>
  );
};

export default TrendingWidgetRoot;
