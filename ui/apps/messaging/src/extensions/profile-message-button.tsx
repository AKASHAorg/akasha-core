import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootExtensionProps, AnalyticsCategories } from '@akashaorg/typings/lib/ui';
import { I18nextProvider } from 'react-i18next';
import { useAnalytics, useRootComponentProps, withProviders } from '@akashaorg/ui-awf-hooks';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

type MessageIconExtensionData = {
  profileId: string;
};

const MessageIconButton: React.FC<RootExtensionProps<MessageIconExtensionData>> = props => {
  const { extensionData } = props;
  const { getRoutingPlugin } = useRootComponentProps();
  const [analyticsActions] = useAnalytics();
  const { profileId } = extensionData;

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });
  const loggedProfileData = profileDataReq.data;

  const isContactReq = null;
  const contactList = isContactReq?.data;

  const isContact = React.useMemo(() => {
    return contactList.includes(profileId as string);
  }, [contactList, profileId]);

  const handleClick = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.MESSAGING,
      action: 'message-button-click',
    });

    getRoutingPlugin().navigateTo?.({
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

const MessageIconButtonWrapper = (props: RootExtensionProps<MessageIconExtensionData>) => {
  const { getTranslationPlugin } = useRootComponentProps();
  return (
    <I18nextProvider i18n={getTranslationPlugin().i18n}>
      <MessageIconButton {...props} />
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(MessageIconButtonWrapper),
  errorBoundary: (err, errorInfo, props: RootExtensionProps<MessageIconExtensionData>) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return <Icon type="ExclamationCircleIcon" />;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = () => Promise.resolve();
