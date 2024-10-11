import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import appRoutes, { SUBMIT_EXTENSION } from '../../../routes';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import DynamicInfiniteScroll from '@akashaorg/design-system-components/lib/components/DynamicInfiniteScroll';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
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

const ENTRY_HEIGHT = 82;

type ExtensionReleaseManagerPageProps = {
  extensionId: string;
};

export const ExtensionReleaseManagerPage: React.FC<ExtensionReleaseManagerPageProps> = ({
  extensionId,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

  const { uiEvents, baseRouteName, getCorePlugins } = useRootComponentProps();
  const navigateTo = getCorePlugins().routing.navigateTo;
  const uiEventsRef = React.useRef(uiEvents);

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
          redirectTo: `${baseRouteName}/${appRoutes[SUBMIT_EXTENSION]}/${extensionId}`,
        }).toString()}`;
      },
    });
  };

  const handleTestReleaseNav = () => {
    navigate({ to: '/release-manager/$extensionId/edit-test-release' });
  };

  const handlePublishReleaseNav = () => {
    navigate({ to: '/release-manager/$extensionId/publish-release' });
  };

  const handleNavigateToReleaseInfoPage = releaseId => {
    navigate({
      to: '/release-manager/$extensionId/release-info/$releaseId',
      params: { extensionId, releaseId },
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
    <Stack padding={16} spacing="gap-y-6">
      <Text variant="h5" weight="semibold" align="start">
        {t('Release Manager')}
      </Text>
      <Card padding={8} background={{ light: 'grey9', dark: 'grey2' }}>
        <ExtensionElement extensionData={extensionData as Extension} />
      </Card>
      <Stack direction="row" justify="between">
        <Text variant="h6" weight="semibold">
          {t('Local Release')}
        </Text>
        <Button label={t('Test release')} variant="secondary" onClick={handleTestReleaseNav} />
      </Stack>
      <Card padding={16} background={{ light: 'grey9', dark: 'grey2' }}>
        <Stack spacing="gap-4">
          <Text variant="body2" weight="semibold">
            {`Release ${localRelease?.version}`}
          </Text>
          <Text variant="footnotes2">{`Release ${localRelease?.description}`}</Text>
        </Stack>
      </Card>
      <Stack direction="row" justify="between">
        <Text variant="h5" weight="semibold">
          {t('Published Releases')}
        </Text>
        <Button label={t('Create release')} variant="primary" onClick={handlePublishReleaseNav} />
      </Stack>
      {appReleases.length === 0 && (
        <InfoCard
          assetName="longbeam-notfound"
          titleLabel={t('You haven’t published any releases yet')}
        />
      )}
      <Card padding={16} background={{ light: 'grey9', dark: 'grey2' }}>
        <DynamicInfiniteScroll
          count={appReleases.length}
          estimatedHeight={ENTRY_HEIGHT}
          overScan={1}
          itemSpacing={16}
          hasNextPage={pageInfo && pageInfo.hasNextPage}
          loading={loadingAppsReleasesQuery}
          onLoadMore={() => {
            return fetchMore({
              variables: {
                after: pageInfo.endCursor,
              },
            });
          }}
        >
          {({ itemIndex }) => {
            const releaseData = appReleases[itemIndex]?.node;
            return (
              <Stack spacing="gap-y-4">
                <Button plain onClick={() => handleNavigateToReleaseInfoPage(releaseData.id)}>
                  <Stack direction="row" justify="between">
                    <Stack justify="between">
                      <Text variant="body2" weight="semibold">
                        {`Release ${releaseData?.version}`}
                      </Text>
                      <Text variant="footnotes2">{releaseData?.createdAt}</Text>
                    </Stack>
                    <Stack>
                      {itemIndex === 0 && (
                        <Pill
                          type="info"
                          borderColor={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                          label={t('Current')}
                        />
                      )}
                    </Stack>
                  </Stack>
                </Button>
                {itemIndex < appReleases.length - 1 && <Divider />}
              </Stack>
            );
          }}
        </DynamicInfiniteScroll>
      </Card>
    </Stack>
  );
};
