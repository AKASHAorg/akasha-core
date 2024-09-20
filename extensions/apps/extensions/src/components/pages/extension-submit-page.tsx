import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import appRoutes, { SUBMIT_EXTENSION } from '../../routes';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import ExtensionReviewAndPublish from '@akashaorg/design-system-components/lib/components/ExtensionReviewAndPublish';
import { transformSource, useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { Extension, NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import { DRAFT_EXTENSIONS } from '../../constants';
import getSDK from '@akashaorg/core-sdk';
import { useCreateAppMutation } from '@akashaorg/ui-awf-hooks/lib/generated';
import { SubmitType } from '../app-routes';

type ExtensionSubmitPageProps = {
  extensionId: string;
};

export const ExtensionSubmitPage: React.FC<ExtensionSubmitPageProps> = ({ extensionId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

  const { uiEvents, baseRouteName, getCorePlugins } = useRootComponentProps();
  const uiEventsRef = React.useRef(uiEvents);

  const navigateTo = getCorePlugins().routing.navigateTo;
  const sdk = useRef(getSDK());

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const [createAppMutation] = useCreateAppMutation({
    context: { source: sdk.current.services.gql.contextSources.composeDB },
    onError: () => {
      showAlertNotification(`${t(`Something went wrong when publishing the extension`)}.`);
    },
  });

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

  const handleClickSubmit = () => {
    const extData = {
      applicationType: extensionData?.applicationType,
      contributors: extensionData?.contributors,
      coverImage: extensionData?.coverImage,
      createdAt: new Date().toISOString(),
      description: extensionData?.description,
      displayName: extensionData?.displayName,
      gallery: extensionData?.gallery,
      keywords: extensionData?.keywords,
      license: extensionData?.license,
      links: extensionData?.links,
      logoImage: extensionData?.logoImage,
      name: extensionData?.name,
      nsfw: extensionData?.nsfw,
    };
    createAppMutation({
      variables: {
        i: {
          content: extData,
        },
      },
    });
    navigate({
      to: '/post-submit',
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
    <Card padding={0}>
      <Stack spacing="gap-y-2">
        <Stack padding={16}>
          <Text variant="h5" weight="semibold" align="center">
            {t('Edit Extension Presentation')}
          </Text>
        </Stack>
        <ExtensionReviewAndPublish
          extensionData={extensionData}
          title={t('Review Extension')}
          subtitle={{
            part1: 'Please note that fields marked with',
            part2: 'cannot be edited once submitted.',
          }}
          extensionNameLabel={t('Extension Name')}
          extensionDisplayNameLabel={t('Extension Display Name')}
          nsfwLabel={t('Extension NSFW')}
          nsfwDescription={t('You marked it as Not Safe For Work')}
          descriptionLabel={t('Description')}
          galleryLabel={t('Gallery')}
          imageUploadedLabel={t('images uploaded')}
          viewAllLabel={t('View All')}
          documentationLabel={t('Documentation')}
          licenseLabel={t('License')}
          contributorsLabel={t('Contributors')}
          contactInfoLabel={t('Contact Info')}
          tagsLabel={t('Tags')}
          backButtonLabel={t('Cancel')}
          publishButtonLabel={t('Submit')}
          transformSource={transformSource}
          onClickCancel={handleClickCancel}
          onClickSubmit={handleClickSubmit}
        />
      </Stack>
    </Card>
  );
};
