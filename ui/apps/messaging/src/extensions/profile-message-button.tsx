import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import DS from '@akashaorg/design-system';
import { RootExtensionProps, AnalyticsCategories } from '@akashaorg/typings/ui';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ThemeWrapper, useAnalytics, withProviders } from '@akashaorg/ui-awf-hooks';

const { Icon, Button } = DS;

const MessageIconButton = (props: RootExtensionProps) => {
  // const { extensionData } = props;
  const [analyticsActions] = useAnalytics();

  const { t } = useTranslation('app-messaging');

  const handleClick = () => {
    // const { pubKey } = extensionData;

    analyticsActions.trackEvent({
      category: AnalyticsCategories.MESSAGING,
      action: 'message-button-click',
    });

    props.plugins?.routing?.navigateTo?.({
      appName: '@akashaorg/app-messaging',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}`,
    });
  };

  return (
    <Button
      primary={true}
      label={'test'}
      icon={<Icon type="email" />}
      onClick={handleClick}
      slimBorder={true}
    />
  );
};

const MessageIconButtonWrapper = (props: RootExtensionProps) => (
  <I18nextProvider i18n={props.plugins?.translation?.i18n}>
    <MessageIconButton {...props} />
  </I18nextProvider>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(MessageIconButtonWrapper),
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return (
      <ThemeWrapper {...props}>
        <Icon type="error" size="sm" />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = () => Promise.resolve();
