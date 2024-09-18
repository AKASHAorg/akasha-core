import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { Extension, NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import { DRAFT_EXTENSIONS } from '../../../constants';
import ExtensionSubmitStep2Form, {
  ExtensionSubmitStep2FormValues,
} from '@akashaorg/design-system-components/lib/components/ExtensionSubmitStep2Form';
import {
  useCreateAppMutation,
  useSetAppReleaseMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated';
import getSDK from '@akashaorg/core-sdk';
import Stepper from '@akashaorg/design-system-core/lib/components/Stepper';

type ExtensionSubmitStep2PageProps = {
  extensionId: string;
};

export const ExtensionSubmitStep2Page: React.FC<ExtensionSubmitStep2PageProps> = ({
  extensionId,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const sdk = useRef(getSDK());
  const { uiEvents } = useRootComponentProps();
  const uiEventsRef = React.useRef(uiEvents);

  const [appReleaseData, setAppReleaseData] = useState<ExtensionSubmitStep2FormValues | null>(null);

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const [createAppMutation] = useCreateAppMutation({
    context: { source: sdk.current.services.gql.contextSources.composeDB },
    onCompleted: data => {
      const appReleaseContent = {
        applicationID: data.setAkashaApp?.document?.id,
        version: appReleaseData?.versionNumber,
        source: appReleaseData?.sourceURL,
        createdAt: new Date().toISOString(),
        meta: [
          {
            provider: 'AkashaApp',
            property: 'description',
            value: appReleaseData?.description,
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
    },
    onError: () => {
      showAlertNotification(`${t(`Something went wrong when creating the extension`)}.`);
    },
  });

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

  const draftExtensions: Extension[] = useMemo(
    () => JSON.parse(localStorage.getItem(`${DRAFT_EXTENSIONS}-${authenticatedDID}`)) || [],
    [authenticatedDID],
  );
  const extensionData = draftExtensions.find(draftExtension => draftExtension.id === extensionId);

  return (
    <Stack spacing="gap-y-2">
      <Stack padding={16} justify="center" align="center">
        <Stepper length={2} currentStep={2} />
      </Stack>
      <Stack padding={16}>
        <Text variant="h5" weight="semibold" align="center">
          {t('Release Notes')}
        </Text>
        <ExtensionSubmitStep2Form
          versionNumberLabel={t('Version Number')}
          descriptionFieldLabel={t('Description')}
          descriptionPlaceholderLabel={t('A brief description about this release')}
          sourceURLFieldLabel={t('Source URL')}
          sourceURLPlaceholderLabel={t('Webpack dev server / ipfs')}
          cancelButton={{
            label: t('Back'),
            disabled: false,
            handleClick: () => {
              navigate({
                to: '/submit-extension/$extensionId/step1',
              });
            },
          }}
          nextButton={{
            label: t('Next'),
            handleClick: data => {
              setAppReleaseData(data);
              createAppMutation({
                variables: {
                  i: {
                    content: extensionData,
                  },
                },
              });

              navigate({
                to: `/submit-extension/$extensionId/step3`,
                params: { extensionId: extensionId },
              });
            },
          }}
        />
      </Stack>
    </Stack>
  );
};
