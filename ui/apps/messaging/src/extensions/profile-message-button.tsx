import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import { useTranslation } from 'react-i18next';
import ReactDOM from 'react-dom';
import DS from '@akashaorg/design-system';
import { RootExtensionProps, AnalyticsCategories } from '@akashaorg/typings/ui';
import { I18nextProvider } from 'react-i18next';
import {
  ThemeWrapper,
  useAnalytics,
  useGetLogin,
  withProviders,
  useIsContactMultiple,
} from '@akashaorg/ui-awf-hooks';

const { Icon, Button, styled, Drop, Box, Text } = DS;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  border: 1px solid ${props => props.theme.colors.accent};
`;

const MessageIconButton = (props: RootExtensionProps) => {
  const { extensionData } = props;
  const { t } = useTranslation('app-messaging');
  const [analyticsActions] = useAnalytics();
  const { pubKey } = extensionData;

  const [showTooltip, setShowTooltip] = React.useState(false);
  const btnRef = React.useRef(null);

  const loginQuery = useGetLogin();
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

    props.plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: '@akashaorg/app-messaging',
      getNavigationUrl: routes => `${routes.chat}/${pubKey}`,
    });
  };

  const handleShowTooltip = () => {
    if (!isContact) {
      setShowTooltip(!showTooltip);
    }
  };

  if (pubKey === loggedUserPubKey) {
    return;
  }

  return (
    <>
      <div ref={btnRef} onClick={handleShowTooltip}>
        <StyledButton
          icon={<Icon type="email" accentColor={true} />}
          onClick={handleClick}
          slimBorder={true}
          disabled={!isContact}
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

const MessageIconButtonWrapper = (props: RootExtensionProps) => (
  <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
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
