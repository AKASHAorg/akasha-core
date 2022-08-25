import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import DS from '@akashaorg/design-system';
import { RootExtensionProps, AnalyticsCategories } from '@akashaorg/typings/ui';
import { I18nextProvider } from 'react-i18next';
import {
  ThemeWrapper,
  useAnalytics,
  useLogin,
  withProviders,
  useIsContactMultiple,
} from '@akashaorg/ui-awf-hooks';

const { Icon, Button, styled } = DS;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  border: 1px solid ${props => props.theme.colors.accentColor};
`;

const MessageIconButton = (props: RootExtensionProps) => {
  const { extensionData } = props;
  const [analyticsActions] = useAnalytics();
  const { pubKey } = extensionData;

  const loginQuery = useLogin();
  const loggedUserPubKey = loginQuery.data?.pubKey;

  const isContactReq = useIsContactMultiple(loggedUserPubKey, [pubKey as string]);
  const contactList = isContactReq.data;

  const isContact = React.useMemo(() => {
    return contactList.includes(pubKey as string);
  }, [contactList, pubKey]);

  const handleClick = () => {
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
      icon={<Icon type="email" accentColor={true} />}
      onClick={handleClick}
      slimBorder={true}
      disabled={!isContact}
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
  renderType: 'createRoot',
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
