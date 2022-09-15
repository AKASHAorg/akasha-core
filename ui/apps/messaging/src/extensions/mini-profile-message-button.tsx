import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import DS from '@akashaorg/design-system';
import { RootExtensionProps, AnalyticsCategories } from '@akashaorg/typings/ui';
import { I18nextProvider, useTranslation } from 'react-i18next';
import {
  ThemeWrapper,
  useAnalytics,
  withProviders,
  useGetLogin,
  useIsContactMultiple,
  validateType,
} from '@akashaorg/ui-awf-hooks';

const { Icon, Button, Box, Drop, Text } = DS;

const MessageButton = (props: RootExtensionProps) => {
  const { extensionData } = props;

  const { t } = useTranslation('app-messaging');

  const [analyticsActions] = useAnalytics();

  const { pubKey } = extensionData;

  const [showTooltip, setShowTooltip] = React.useState(false);
  const btnRef = React.useRef(null);

  const loginQuery = useGetLogin();
  const loggedUserPubKey = loginQuery.data?.pubKey;

  const contactsToCheck = [];
  if (validateType(pubKey, 'string')) {
    contactsToCheck.push(pubKey);
  }

  const isContactReq = useIsContactMultiple(loggedUserPubKey, contactsToCheck);
  const contactList = isContactReq.data;

  const isContact = React.useMemo(() => {
    return contactList.includes(pubKey as string);
  }, [contactList, pubKey]);

  const handleClick = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.MESSAGING,
      action: 'message-button-click',
    });

    props.plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: '@akashaorg/app-messaging',
      getNavigationUrl: routes => `${routes.chat}/${pubKey}`,
    });
  };

  const handleShowTooltip = (ev: React.SyntheticEvent) => {
    ev.stopPropagation();
    if (!isContact) {
      setShowTooltip(!showTooltip);
    }
  };

  return (
    <>
      <div ref={btnRef} onClick={handleShowTooltip}>
        <Button
          icon={<Icon type="email" accentColor={true} />}
          label={t('Message')}
          onClick={handleClick}
          slimBorder={true}
          disabled={!isContact}
          fill={true}
        />
      </div>
      {showTooltip && btnRef.current && (
        <Drop
          margin={{ top: '5px' }}
          align={{ top: 'bottom' }}
          target={btnRef.current}
          onClickOutside={() => setShowTooltip(false)}
        >
          <Box
            background="activePanelBackground"
            round="xsmall"
            pad="xsmall"
            flex={{ shrink: 0 }}
            width={{ min: '200px' }}
          >
            <Text>{t('You need to follow each other to start using the messaging app')}</Text>
          </Box>
        </Drop>
      )}
    </>
  );
};

const MessageButtonWrapper = (props: RootExtensionProps) => (
  <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
    <MessageButton {...props} />
  </I18nextProvider>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(MessageButtonWrapper),
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
