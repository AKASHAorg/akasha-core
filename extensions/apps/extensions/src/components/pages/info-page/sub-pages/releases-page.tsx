import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import {
  AkashaAppApplicationType,
  AppImageSource,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import InfoSubRouteHeader from '../InfoSubroutePageHeader';
import DynamicInfiniteScroll from '@akashaorg/design-system-core/lib/components/DynamicInfiniteScroll';
import { useGetAppsReleasesQuery } from '@akashaorg/ui-core-hooks/lib/generated';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import { NetworkStatus } from '@apollo/client';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { Loader2 } from 'lucide-react';
import {
  selectAppsReleases,
  selectAppsReleasesPageInfo,
} from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-releases-query';
import DefaultEmptyCard from '@akashaorg/design-system-components/lib/components/DefaultEmptyCard';
type ReleasesPageProps = {
  appName: string;
  appId: string;
  extensionLogo: AppImageSource;
  extensionName: string;
  extensionDisplayName: string;
  extensionType: AkashaAppApplicationType;
  releasesCount: number;
};
export const ReleasesPage = (props: ReleasesPageProps) => {
  const {
    extensionDisplayName,
    extensionName,
    extensionLogo,
    extensionType,
    appId,
    releasesCount,
  } = props;
  const { t } = useTranslation('app-extensions');
  const [expandedRelease, setExpandedRelease] = useState(null);
  const releasesReq = useGetAppsReleasesQuery({
    variables: {
      first: Math.min(10, releasesCount),
      filters: {
        where: {
          applicationID: {
            equalTo: appId,
          },
        },
      },
      sorting: {
        createdAt: SortOrder.Desc,
      },
    },
  });
  const handleReadMoreClick = (releaseId?: string) => () => {
    if (releaseId) {
      setExpandedRelease(releaseId);
    }
  };
  const handleLoadMoreReleases = () => {
    const edges = selectAppsReleases(releasesReq.data);
    const pageInfo = selectAppsReleasesPageInfo(releasesReq.data);
    if (edges.length < releasesCount && pageInfo.endCursor.length) {
      releasesReq.fetchMore({
        variables: {
          after: pageInfo.endCursor,
        },
      });
    }
  };
  const releases = useMemo(() => {
    return releasesReq.data?.akashaAppReleaseIndex.edges || [];
  }, [releasesReq]);
  useEffect(() => {
    if (releases && releases.length > 0 && !expandedRelease) {
      setExpandedRelease(releases[0].node?.id);
    }
  }, [expandedRelease, releases]);
  const hasErrors = useMemo(() => {
    return releasesReq.networkStatus === NetworkStatus.error;
  }, [releasesReq]);
  return (
    <>
      <Card className="p-4">
        <Stack spacing={4}>
          <InfoSubRouteHeader
            pageTitle={t('Releases')}
            appName={extensionDisplayName}
            packageName={extensionName}
            appLogo={extensionLogo}
            appType={extensionType}
          />
          {hasErrors && (
            <>
              <Divider />
              <ErrorLoader type="list-not-available" className="border-none bg-transparent">
                <ErrorLoaderTitle>{t('Loading error')}</ErrorLoaderTitle>
                <ErrorLoaderDescription>
                  {t('There was an error loading the releases')}
                </ErrorLoaderDescription>
              </ErrorLoader>
            </>
          )}
          {releasesReq.networkStatus === NetworkStatus.ready && !releases.length && (
            <>
              <Divider />
              <DefaultEmptyCard
                noBorder={true}
                assetName="longbeam-notfound"
                infoText={t('There are no releases for this extension yet')}
              />
            </>
          )}
          {releases && releases.length > 0 && (
            <DynamicInfiniteScroll
              count={releases.length}
              overScan={5}
              estimatedHeight={80}
              itemSpacing={16}
              onLoadMore={handleLoadMoreReleases}
              loading={releasesReq.loading}
              hasNextPage={releasesReq.data?.akashaAppReleaseIndex?.pageInfo.hasNextPage}
            >
              {item => {
                const release = releases[item.itemIndex];
                if (!release) return null;
                const isExpanded = expandedRelease === release.node?.id;
                const description = release.node?.meta?.find(
                  m => m.property === 'description',
                )?.value;
                return (
                  <Stack direction="column">
                    <Divider />
                    <Stack direction="row" justifyContent="between" className="mt-3 mb-2">
                      <Typography variant="h6">
                        {t('Version')} {release.node?.version}
                      </Typography>
                      <Typography variant="xs" className="font-medium text-grey4 dark:text-grey6">
                        {formatDate(release.node?.createdAt, 'DD MMM YYYY')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="between">
                      <Typography variant="xs" className="font-medium">
                        {description}
                        {!description && t('This release has no description added')}
                      </Typography>
                      {!isExpanded && description && (
                        <Button variant="link" onClick={handleReadMoreClick(release.node?.id)}>
                          {t('Read More')}
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                );
              }}
            </DynamicInfiniteScroll>
          )}
          {releasesReq.loading && (
            <Stack direction="column" alignItems="center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Stack>
          )}
        </Stack>
      </Card>
    </>
  );
};
