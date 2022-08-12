import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import DS from '@akashaorg/design-system';
import { RootExtensionProps, AnalyticsCategories } from '@akashaorg/typings/ui';
import { I18nextProvider } from 'react-i18next';
import { ThemeWrapper, useAnalytics, withProviders } from '@akashaorg/ui-awf-hooks';

const { Icon, Button, styled } = DS;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
`;

const MessageIconButton = (props: RootExtensionProps) => {
  const { extensionData } = props;
  const [analyticsActions] = useAnalytics();

  const handleClick = () => {
    const { pubKey } = extensionData;

    analyticsActions.trackEvent({
      category: AnalyticsCategories.MESSAGING,
      action: 'message-button-click',
    });

    props.plugins.routing?.navigateTo?.({
      appName: '@akashaorg/app-messaging',
      getNavigationUrl: routes => `${routes.chat}/${pubKey}`,
    });
  };

  return (
    <StyledButton
      primary={true}
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
