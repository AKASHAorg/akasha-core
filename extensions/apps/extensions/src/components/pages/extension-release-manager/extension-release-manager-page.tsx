import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import DynamicInfiniteScroll from '@akashaorg/design-system-components/lib/components/DynamicInfiniteScroll';
import { useAkashaStore, useDismissedCard, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { Extension, NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import {
  useGetAppsByIdQuery,
  useGetAppsReleasesQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated';
import { DRAFT_EXTENSIONS, DRAFT_RELEASES } from '../../../constants';
import { SortOrder } from '@akashaorg/typings/lib/sdk/graphql-types-new';

import { ExtensionElement } from '../my-extensions/extension-element';
import {
  selectAppsReleases,
  selectAppsReleasesPageInfo,
} from '@akashaorg/ui-awf-hooks/lib/selectors/get-apps-releases-query';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Modal from '@akashaorg/design-system-core/lib/components/Modal';

const ENTRY_HEIGHT = 82;

type ExtensionReleaseManagerPageProps = {
  extensionId: string;
};

export const ExtensionReleaseManagerPage: React.FC<ExtensionReleaseManagerPageProps> = ({
  extensionId,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

  const { uiEvents, baseRouteName, getCorePlugins, getTranslationPlugin } = useRootComponentProps();
  const locale = getTranslationPlugin().i18n?.languages?.[0] || 'en';
  const navigateTo = getCorePlugins().routing.navigateTo;
  const uiEventsRef = React.useRef(uiEvents);

  const [dismissed, dismissCard] = useDismissedCard(
    '@akashaorg/ui-release-manager_draft-info-card',
  );

  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const showErrorNotification = React.useCallback((title: string) => {
    uiEventsRef.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Error,
        title,
      },
    });
  }, []);

  const draftExtensions: Extension[] = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(`${DRAFT_EXTENSIONS}-${authenticatedDID}`)) || [];
    } catch (error) {
      showErrorNotification(error);
    }
  }, [authenticatedDID, showErrorNotification]);

  const localExtensionData = draftExtensions.find(ext => ext.id === extensionId);

  const {
    data: appsByIdReq,
    loading: loadingAppsByIdQuery,
    error: appsByIdError,
  } = useGetAppsByIdQuery({ variables: { id: extensionId } });

  const publishedAppData = appsByIdReq?.node;

  const extensionData = useMemo(() => {
    if (publishedAppData && 'applicationType' in publishedAppData) {
      return publishedAppData;
    }
    return localExtensionData;
  }, [localExtensionData, publishedAppData]);

  const draftReleases = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(`${DRAFT_RELEASES}-${authenticatedDID}`)) || [];
    } catch (error) {
      showErrorNotification(error);
    }
  }, [authenticatedDID, showErrorNotification]);

  const localRelease = draftReleases.find(release => release.applicationID === extensionId);

  const {
    data: appsReleasesReq,
    loading: loadingAppsReleasesQuery,
    error: appsReleasesError,
    fetchMore,
  } = useGetAppsReleasesQuery({
    variables: {
      first: 10,
      filters: { where: { applicationID: { equalTo: extensionId } } },
      sorting: { createdAt: SortOrder.Desc },
    },
  });

  const appReleases = selectAppsReleases(appsReleasesReq);

  const pageInfo = selectAppsReleasesPageInfo(appsReleasesReq);

  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/release-manager/${extensionId}`,
        }).toString()}`;
      },
    });
  };

  const handleTestReleaseNav = () => {
    // if there is no local test release create it now
    if (!localRelease) {
      const newRelease = {
        applicationID: extensionId,
        version: '0.0.1',
        description: 'Introduced the core functionality allowing developer to test.',
        source: '',
      };

      localStorage.setItem(
        `${DRAFT_RELEASES}-${authenticatedDID}`,
        JSON.stringify([...draftReleases, newRelease]),
      );
    }
    navigate({ to: '/release-manager/$extensionId/edit-test-release', params: { extensionId } });
  };

  const handlePublishReleaseNav = () => {
    navigate({ to: '/release-manager/$extensionId/publish-release', params: { extensionId } });
  };

  const handlePublishExtensionNav = () => {
    navigate({ to: '/publish-extension/$extensionId', params: { extensionId } });
  };

  const handleNavigateToReleaseInfoPage = releaseId => {
    navigate({
      to: '/release-manager/$extensionId/release-info/$releaseId',
      params: { extensionId, releaseId },
    });
  };

  const handleClickPublishReleaseButton = () => {
    publishedAppData ? handlePublishReleaseNav() : setShowModal(true);
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
    <>
      <Stack padding={16} spacing="gap-y-6">
        {!dismissed && (
          <Stack
            padding="p-4"
            background={{ light: 'grey9', dark: 'grey5' }}
            customStyle="rounded-3xl"
          >
            <Stack direction="row" align="start" justify="between">
              <Stack customStyle="w-9/12">
                <Text variant="body2" weight="light">
                  {t(
                    'We’ve generated a first draft release for you as soon as you created your extension. You can use it to submit your first release or test it locally!',
                  )}
                </Text>
              </Stack>
              <Button plain={true} onClick={dismissCard}>
                <Icon icon={<XMarkIcon />} size="sm" />
              </Button>
            </Stack>
          </Stack>
        )}
        <Text variant="h5" weight="semibold" align="start">
          {t('Release Manager')}
        </Text>
        <Card padding={8} background={{ light: 'grey9', dark: 'grey2' }}>
          <Stack customStyle="w-0 min-w-full" padding={0}>
            <ExtensionElement extensionData={extensionData as Extension} />
          </Stack>
        </Card>
        <Stack direction="row" justify="between">
          <Text variant="h6" weight="semibold">
            {t('Local Release')}
          </Text>
          <Button label={t('Test release')} variant="secondary" onClick={handleTestReleaseNav} />
        </Stack>
        {localRelease && (
          <Card padding={16} background={{ light: 'grey9', dark: 'grey2' }}>
            <Stack spacing="gap-4">
              <Text variant="body2" weight="semibold">
                {`Release ${localRelease?.version || '0.0.1'}`}
              </Text>
              <Text variant="footnotes2">{`Release ${localRelease?.description || t('A local test release')}`}</Text>
            </Stack>
          </Card>
        )}
        <Stack direction="row" justify="between">
          <Text variant="h6" weight="semibold">
            {t('Published Releases')}
          </Text>
          <Button
            label={t('Create release')}
            variant="primary"
            onClick={handleClickPublishReleaseButton}
          />
        </Stack>
        {appReleases?.length === 0 && (
          <InfoCard
            assetName="longbeam-notfound"
            titleLabel={t('You haven’t published any releases yet')}
          />
        )}
        {appReleases?.length > 0 && (
          <Card padding={16} background={{ light: 'grey9', dark: 'grey2' }}>
            <DynamicInfiniteScroll
              count={appReleases?.length}
              estimatedHeight={ENTRY_HEIGHT}
              overScan={1}
              itemSpacing={16}
              hasNextPage={pageInfo && pageInfo?.hasNextPage}
              loading={loadingAppsReleasesQuery}
              onLoadMore={() => {
                return fetchMore({
                  variables: {
                    after: pageInfo?.endCursor,
                  },
                });
              }}
            >
              {({ itemIndex }) => {
                const releaseData = appReleases[itemIndex]?.node;
                const createdAt = releaseData
                  ? formatDate(releaseData.createdAt, 'D MMM YYYY', locale)
                  : '';
                return (
                  <Stack spacing="gap-y-4">
                    <Button plain onClick={() => handleNavigateToReleaseInfoPage(releaseData.id)}>
                      <Stack direction="row" justify="between" align="center">
                        <Stack spacing="gap-y-4">
                          <Stack direction="row" spacing="gap-x-2" align="center">
                            <Text variant="body2" weight="semibold">
                              {`Release ${releaseData?.version}`}
                            </Text>
                            {itemIndex === 0 && (
                              <Pill
                                type="info"
                                borderColor={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                                label={t('Current')}
                              />
                            )}
                          </Stack>
                          <Text variant="footnotes2">{createdAt}</Text>
                        </Stack>
                        <Icon icon={<ChevronRightIcon />} accentColor={true} size="xl" />
                      </Stack>
                    </Button>
                    {itemIndex < appReleases?.length - 1 && <Divider />}
                  </Stack>
                );
              }}
            </DynamicInfiniteScroll>
          </Card>
        )}
      </Stack>
      <Modal
        show={showModal}
        onClose={handleModalClose}
        actions={[
          {
            label: t('Cancel'),
            variant: 'secondary',

            onClick: handleModalClose,
          },
          {
            label: t('Publish Extension'),
            variant: 'primary',
            onClick: handlePublishExtensionNav,
          },
        ]}
        title={{ label: t('Release Cannot Be Published') }}
      >
        <Stack customStyle="max-w-[567px]">
          <Text variant="body1" align="center">
            {t(
              'It appears your extension is currently in draft mode. To proceed with publishing a release, you’ll need to publish the extension first.',
            )}
          </Text>
        </Stack>
      </Modal>
    </>
  );
};
