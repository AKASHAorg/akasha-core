import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { BookOpenIcon } from 'lucide-react';
import {
  filterEvents,
  hasOwn,
  useAkashaStore,
  useRootComponentProps,
} from '@akashaorg/ui-core-hooks';
import { useGetAppsByPublisherDidQuery } from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import {
  EventTypes,
  ExtensionStatus,
  NotificationEvents,
  NotificationTypes,
  UIEventData,
} from '@akashaorg/typings/lib/ui';
import { SortOrder, AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@akashaorg/ui/lib/components/select';
import DefaultEmptyCard from '@akashaorg/design-system-components/lib/components/DefaultEmptyCard';
import DynamicInfiniteScroll from '@akashaorg/design-system-core/lib/components/DynamicInfiniteScroll';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderTitle,
  ErrorLoaderFooter,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { ExtensionElement } from './extension-element';
import appRoutes, { MY_EXTENSIONS } from '../../../routes';
import { DRAFT_EXTENSIONS } from '../../../constants';
const ENTRY_HEIGHT = 92;
export const MyExtensionsPage: React.FC<unknown> = () => {
  const { uiEvents, baseRouteName, getCorePlugins } = useRootComponentProps();
  const uiEventsRef = React.useRef(uiEvents);
  const { t } = useTranslation('app-extensions');
  const navigate = useNavigate();
  const navigateTo = getCorePlugins().routing.navigateTo;
  const showErrorNotification = React.useCallback((title: string) => {
    uiEventsRef.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Error,
        title,
      },
    });
  }, []);
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const handleNavigateToCreateApp = () => {
    navigate({
      to: '/create-extension',
    });
  };
  const extensionTypeMenuItems = useMemo(
    () => [
      capitalize(AkashaAppApplicationType.App),
      capitalize(AkashaAppApplicationType.Widget),
      capitalize(AkashaAppApplicationType.Plugin),
      capitalize(AkashaAppApplicationType.Other),
    ],
    [],
  );
  const extensionStatusMenuItems = [
    ExtensionStatus.LocalDraft,
    ExtensionStatus.Draft,
    ExtensionStatus.InReview,
    ExtensionStatus.Published,
  ];

  const [selectedType, setSelectedType] = React.useState<string>('');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('');

  const handleResetClick = () => {
    setSelectedStatus('');
    setSelectedType('');
  };
  const {
    data: appsByPubReqData,
    error,
    loading,
    fetchMore,
  } = useGetAppsByPublisherDidQuery({
    variables: {
      id: authenticatedDID,
      first: 10,
      sorting: {
        createdAt: SortOrder.Desc,
      },
    },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    skip: !authenticatedDID,
  });
  const appsList = useMemo(() => {
    return appsByPubReqData?.node && hasOwn(appsByPubReqData.node, 'akashaAppList')
      ? appsByPubReqData.node.akashaAppList
      : null;
  }, [appsByPubReqData]);
  const appsData = useMemo(() => {
    return appsList?.edges?.map(edge => edge.node) || [];
  }, [appsList]);
  const pageInfo = useMemo(() => {
    return appsList?.pageInfo;
  }, [appsList]);
  const appElements = useMemo(() => {
    return appsData?.filter(ext => {
      return ext?.applicationType === selectedType.toUpperCase();
    });
  }, [appsData, selectedType]);

  const [draftExtensions, setDraftExtensions] = useState([]);

  // fetch the draft extensions that are saved only on local storage
  const getDraftExtensions = useCallback(() => {
    try {
      const existingDraftExtensions =
        JSON.parse(localStorage.getItem(`${DRAFT_EXTENSIONS}-${authenticatedDID}`)) ?? [];
      setDraftExtensions(existingDraftExtensions);
    } catch (error) {
      showErrorNotification(error);
      setDraftExtensions([]);
    }
  }, [authenticatedDID, showErrorNotification]);
  useEffect(() => {
    getDraftExtensions();
    // subscribe and listen to events
    const eventsSub = uiEventsRef.current
      .pipe(filterEvents([EventTypes.RefetchMyExtensions]))
      .subscribe({
        next: (eventInfo: UIEventData) => {
          if (eventInfo.event === EventTypes.RefetchMyExtensions) {
            getDraftExtensions();
          }
        },
      });
    return () => {
      if (eventsSub) {
        eventsSub.unsubscribe();
      }
    };
  }, [authenticatedDID, getDraftExtensions]);
  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/${appRoutes[MY_EXTENSIONS]}`,
        }).toString()}`;
      },
    });
  };
  const allMyExtensions = useMemo(
    () => [...draftExtensions, ...appElements],
    [draftExtensions, appElements],
  );
  if (!authenticatedDID) {
    return (
      <ErrorLoader type="not-authenticated">
        <ErrorLoaderTitle>{t('Uh-oh! You are not connected!')}</ErrorLoaderTitle>
        <ErrorLoaderDescription>
          {t('To check your extensions you must be connected')} ⚡️
        </ErrorLoaderDescription>
        <ErrorLoaderFooter>
          <Button onClick={handleConnectButtonClick}>{t('Connect')}</Button>
        </ErrorLoaderFooter>
      </ErrorLoader>
    );
  }
  return (
    <Stack spacing={4}>
      <Stack direction="row" justifyContent="between">
        <Typography variant="h5">{t('My extensions')}</Typography>
        <Link target="_blank" to="https://docs.akasha.world" customStyle="w-fit self-end">
          <BookOpenIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
        </Link>
      </Stack>
      <Stack
        direction="row"
        justifyContent="between"
        alignItems="center"
        className="p-3 bg-inherit rounded-[1.25rem] bg-nested-card"
      >
        <Typography>{t('Create an extension ✨ 🚀')}</Typography>
        <Button size="sm" onClick={handleNavigateToCreateApp}>
          {t('Create')}
        </Button>
      </Stack>
      <Stack direction="row" justifyContent="between" alignItems="center" spacing={4}>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="grow text-foreground">
            <SelectValue placeholder={t('Type')} />
          </SelectTrigger>
          <SelectContent>
            {extensionTypeMenuItems.map(item => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="grow text-foreground">
            <SelectValue placeholder={t('Status')} />
          </SelectTrigger>
          <SelectContent>
            {extensionStatusMenuItems.map(item => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="link" size="sm" onClick={handleResetClick}>
          {t('Reset')}
        </Button>
      </Stack>
      {error && (
        <ErrorLoader type="script-error">
          <ErrorLoaderTitle>Sorry, there was an error when fetching apps</ErrorLoaderTitle>
          <ErrorLoaderDescription>{error.message}</ErrorLoaderDescription>
        </ErrorLoader>
      )}
      {!error && allMyExtensions?.length === 0 && (
        <DefaultEmptyCard
          noBorder={true}
          infoText={t("You haven't created any extensions yet")}
          assetName="longbeam-notfound"
        />
      )}
      {!error && allMyExtensions?.length > 0 && (
        <Card className="shadow-none overflow-visible">
          <DynamicInfiniteScroll
            count={allMyExtensions.length}
            estimatedHeight={ENTRY_HEIGHT}
            overScan={1}
            itemSpacing={16}
            hasNextPage={pageInfo && pageInfo.hasNextPage}
            loading={loading}
            onLoadMore={() => {
              return fetchMore({
                variables: {
                  after: pageInfo.endCursor,
                },
              });
            }}
          >
            {({ itemIndex }) => {
              const extensionData = allMyExtensions[itemIndex];
              return (
                <ExtensionElement
                  key={itemIndex}
                  extensionId={extensionData?.id}
                  extensionName={extensionData?.name}
                  extensionDisplayName={extensionData?.displayName}
                  extensionDescription={extensionData?.description}
                  extensionApplicationType={extensionData?.applicationType}
                  extensionLogoImage={extensionData?.logoImage}
                  isExtensionLocalDraft={extensionData?.localDraft}
                  showDivider={itemIndex < allMyExtensions.length - 1}
                  filter={selectedStatus}
                  filterShowAllOptionValue={extensionStatusMenuItems[0]}
                  showMenu
                />
              );
            }}
          </DynamicInfiniteScroll>
        </Card>
      )}
    </Stack>
  );
};
