import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import { useTranslation } from 'react-i18next';
import ReactDOM from 'react-dom';
import { RootExtensionProps, AnalyticsCategories } from '@akashaorg/typings/ui';
import { I18nextProvider } from 'react-i18next';
import {
  ThemeWrapper,
  useAnalytics,
  withProviders,
  useIsContactMultiple,
} from '@akashaorg/ui-awf-hooks';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

const MessageIconButton = (props: RootExtensionProps) => {
  const { extensionData } = props;
  const { t } = useTranslation('app-messaging');
  const [analyticsActions] = useAnalytics();
  const { profileId } = extensionData;

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.profile;
    },
  });
  const loggedProfileData = profileDataReq.data;

  const isContactReq = useIsContactMultiple(loggedProfileData.did.id, [profileId as string]);
  const contactList = isContactReq.data;

  const isContact = React.useMemo(() => {
    return contactList.includes(profileId as string);
  }, [contactList, profileId]);

  const handleClick = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.MESSAGING,
      action: 'message-button-click',
    });

    props.plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: '@akashaorg/app-messaging',
      getNavigationUrl: routes => `${routes.chat}/${profileId}`,
    });
  };

  if (profileId === loggedProfileData.did.id) {
    return;
  }

  return (
    <Button
      customStyle="flex items-center border(secondaryLight dark:secondaryDark)"
      icon="EnvelopeIcon"
      onClick={handleClick}
      disabled={!isContact}
    />
  );
};

const MessageIconButtonWrapper = (props: RootExtensionProps) => (
  <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
    <MessageIconButton {...props} />
  </I18nextProvider>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(MessageIconButtonWrapper),
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return (
      <ThemeWrapper {...props}>
        <Icon type="ExclamationCircleIcon" />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = () => Promise.resolve();
