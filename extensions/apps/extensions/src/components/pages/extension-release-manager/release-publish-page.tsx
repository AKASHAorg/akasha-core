import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import ExtensionReleasePublishForm from '@akashaorg/design-system-components/lib/components/ExtensionReleasePublishForm';
import { useSetAppReleaseMutation } from '@akashaorg/ui-awf-hooks/lib/generated';
import getSDK from '@akashaorg/core-sdk';
import { SubmitType } from '../../app-routes';
import { PROPERTY, PROVIDER } from '../../../constants';

type ExtensionReleasePublishPageProps = {
  extensionId: string;
};

export const ExtensionReleasePublishPage: React.FC<ExtensionReleasePublishPageProps> = ({
  extensionId,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const sdk = useRef(getSDK());

  const { uiEvents, baseRouteName, getCorePlugins } = useRootComponentProps();
  const navigateTo = getCorePlugins().routing.navigateTo;
  const uiEventsRef = React.useRef(uiEvents);

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const [setAppReleaseMutation, { loading }] = useSetAppReleaseMutation({
    context: { source: sdk.current.services.gql.contextSources.composeDB },
    onCompleted: () => {
      navigate({
        to: `/post-publish`,
        search: { type: SubmitType.RELEASE },
      });
    },
    onError: () => {
      showErrorNotification(
        `${t(`Something went wrong when setting the release for this extension`)}.`,
      );
    },
  });

  const showErrorNotification = React.useCallback((title: string) => {
    uiEventsRef.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Error,
        title,
      },
    });
  }, []);

  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/release-manager/${extensionId}/publish-release`,
        }).toString()}`;
      },
    });
  };

  const handleClickSubmit = appReleaseFormData => {
    const appReleaseContent = {
      applicationID: extensionId,
      version: appReleaseFormData?.versionNumber,
      source: appReleaseFormData?.sourceURL,
      createdAt: new Date().toISOString(),
      meta: [
        {
          provider: PROVIDER,
          property: PROPERTY,
          value: appReleaseFormData?.description,
        },
      ],
    };
    setAppReleaseMutation({
      variables: {
        i: {
          content: appReleaseContent,
        },
      },
    });
  };

  const handleClickCancel = () => {
    navigate({
      to: '/release-manager/$extensionId',
      params: { extensionId },
    });
  };

  if (!authenticatedDID) {
    return (
      <ErrorLoader
        type="not-authenticated"
        title={`${t('Uh-oh')}! ${t('You are not connected')}!`}
        details={`${t('To check your extensions you must be connected')} ⚡️`}
      >
        <Button variant="primary" label={t('Connect')} onClick={handleConnectButtonClick} />
      </ErrorLoader>
    );
  }

  return (
    <Card padding={0}>
      <Stack spacing="gap-y-2">
        <Stack padding={16}>
          <Text variant="h5" weight="semibold" align="center">
            {t('Release Notes')}
          </Text>
          <ExtensionReleasePublishForm
            versionNumberLabel={t('Version Number')}
            descriptionFieldLabel={t('Description')}
            descriptionPlaceholderLabel={t('A brief description about this release')}
            sourceURLFieldLabel={t('Source URL')}
            sourceURLPlaceholderLabel={t('Webpack dev server / ipfs')}
            loading={loading}
            requireVersionNumber={true}
            requireDescription={true}
            cancelButton={{
              label: t('Cancel'),
              handleClick: handleClickCancel,
            }}
            nextButton={{
              label: t('Publish'),
              handleClick: handleClickSubmit,
            }}
          />
        </Stack>
      </Stack>
    </Card>
  );
};
