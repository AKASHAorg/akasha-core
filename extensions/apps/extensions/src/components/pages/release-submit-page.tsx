import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import appRoutes, { SUBMIT_EXTENSION } from '../../routes';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import ExtensionReleaseSubmitForm from '@akashaorg/design-system-components/lib/components/ExtensionReleaseSubmitForm';
import { useSetAppReleaseMutation } from '@akashaorg/ui-awf-hooks/lib/generated';
import getSDK from '@akashaorg/core-sdk';

import { SubmitType } from '../app-routes';

type ExtensionReleaseSubmitPageProps = {
  extensionId: string;
};

export const ExtensionReleaseSubmitPage: React.FC<ExtensionReleaseSubmitPageProps> = ({
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

  const [setAppReleaseMutation] = useSetAppReleaseMutation({
    context: { source: sdk.current.services.gql.contextSources.composeDB },
    onCompleted: () => {},
    onError: () => {
      showAlertNotification(
        `${t(`Something went wrong when setting the release for this extension`)}.`,
      );
    },
  });

  const showAlertNotification = React.useCallback((title: string) => {
    uiEventsRef.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Info,
        title,
      },
    });
  }, []);

  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/${appRoutes[SUBMIT_EXTENSION]}/${extensionId}`,
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
          provider: 'AkashaApp',
          property: 'description',
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
    navigate({
      to: `/post-submit`,
      search: { type: SubmitType.EXTENSION },
    });
  };

  const handleClickCancel = () => {
    navigate({
      to: '/my-extensions',
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
    <Stack spacing="gap-y-2">
      <Stack padding={16}>
        <Text variant="h5" weight="semibold" align="center">
          {t('Release Notes')}
        </Text>
        <ExtensionReleaseSubmitForm
          versionNumberLabel={t('Version Number')}
          descriptionFieldLabel={t('Description')}
          descriptionPlaceholderLabel={t('A brief description about this release')}
          sourceURLFieldLabel={t('Source URL')}
          sourceURLPlaceholderLabel={t('Webpack dev server / ipfs')}
          cancelButton={{
            label: t('Cancel'),
            handleClick: handleClickCancel,
          }}
          nextButton={{
            label: t('Submit'),
            handleClick: handleClickSubmit,
          }}
        />
      </Stack>
    </Stack>
  );
};
