import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderFooter,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Loader2 } from 'lucide-react';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { Extension, NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import { ExtensionElement } from '../my-extensions/extension-element';
import { DRAFT_EXTENSIONS, PROPERTY, PROVIDER } from '../../../constants';
import { useGetAppReleaseByIdQuery } from '@akashaorg/ui-core-hooks/lib/generated';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import {
  AkashaAppApplicationType,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { NetworkStatus } from '@apollo/client';
type ExtensionReleaseInfoPageProps = {
  extensionId: string;
  extensionName?: string;
  extensionDisplayName?: string;
  extensionDescription?: string;
  extensionApplicationType?: AkashaAppApplicationType;
  extensionLogoImage?: AppImageSource;
  networkStatus: NetworkStatus;
  releaseId: string;
};
export const ExtensionReleaseInfoPage: React.FC<ExtensionReleaseInfoPageProps> = ({
  extensionId,
  extensionName,
  extensionDisplayName,
  extensionDescription,
  extensionApplicationType,
  extensionLogoImage,
  networkStatus,
  releaseId,
}) => {
  const { t } = useTranslation('app-extensions');
  const { uiEvents, baseRouteName, getCorePlugins, getTranslationPlugin } = useRootComponentProps();
  const locale = getTranslationPlugin().i18n?.languages?.[0] || 'en';
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
  const draftExtension = draftExtensions.find(ext => ext.id === extensionId);
  const baseAppInfo = useMemo(() => {
    // if a published extension exists for this id use the data from it
    if (networkStatus === NetworkStatus.ready && extensionName && extensionApplicationType) {
      return {
        id: extensionId,
        name: extensionName,
        displayName: extensionDisplayName,
        description: extensionDescription,
        logoImage: extensionLogoImage,
        applicationType: extensionApplicationType,
        localDraft: false,
      };
    }
    if (draftExtension) {
      return draftExtension;
    }
  }, [
    networkStatus,
    extensionName,
    extensionApplicationType,
    draftExtension,
    extensionId,
    extensionDisplayName,
    extensionDescription,
    extensionLogoImage,
  ]);
  const { data: releaseByIdReq, loading: loadingReleaseByIdQuery } = useGetAppReleaseByIdQuery({
    variables: {
      id: releaseId,
    },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });
  const releaseData = useMemo(() => {
    if (releaseByIdReq?.node && 'id' in releaseByIdReq.node) {
      return releaseByIdReq.node;
    }
    return null;
  }, [releaseByIdReq]);
  const createdAt = releaseData ? formatDate(releaseData.createdAt, 'D MMM YYYY', locale) : '';
  const description = releaseData?.meta.find(
    metaProperty => metaProperty.property === PROPERTY && metaProperty.provider === PROVIDER,
  )?.value;
  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/release-manager/${extensionId}/release-info/${releaseId}`,
        }).toString()}`;
      },
    });
  };
  if (!authenticatedDID) {
    return (
      <ErrorLoader type="not-authenticated">
        <ErrorLoaderTitle>{`${t('Uh-oh')}! ${t('You are not connected')}!`}</ErrorLoaderTitle>
        <ErrorLoaderDescription>{`${t('To check your extensions you must be connected')} ⚡️`}</ErrorLoaderDescription>
        <ErrorLoaderFooter>
          <Button onClick={handleConnectButtonClick}>{t('Connect')}</Button>
        </ErrorLoaderFooter>
      </ErrorLoader>
    );
  }
  return (
    <Card className="p-4">
      <Stack spacing={6}>
        <Card className="p-2">
          {loadingReleaseByIdQuery && (
            <Stack alignItems="center" justifyContent="center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Stack>
          )}
          {!loadingReleaseByIdQuery && (
            <ExtensionElement
              extensionId={baseAppInfo?.id}
              extensionName={baseAppInfo?.name}
              extensionDisplayName={baseAppInfo?.displayName}
              extensionDescription={baseAppInfo?.description}
              extensionApplicationType={baseAppInfo?.applicationType}
              extensionLogoImage={baseAppInfo?.logoImage}
              isExtensionLocalDraft={baseAppInfo?.localDraft}
            />
          )}
        </Card>
        <Stack direction="row" justifyContent="between">
          <Typography variant="h6" className="font-semibold">
            {t('Version Number')}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Typography variant="sm">{releaseData?.version}</Typography>
            {/* @TODO: find a way to tell this is the latest release */}
            {/* <Pill
              type="info"
              borderColor={{ light: 'secondaryLight', dark: 'secondaryDark' }}
              label={t('Current')}
             /> */}
          </Stack>
        </Stack>

        <Separator />

        <Stack spacing={4}>
          <Typography variant="h6" className="font-semibold break-all">
            {t('Description')}
          </Typography>
          <Typography variant="sm" className="break-all">
            {description}
          </Typography>
        </Stack>

        <Separator />

        <Stack spacing={4}>
          <Typography variant="h6" className="font-semibold">
            {t('Source URL')}
          </Typography>
          <Typography variant="sm" className="text-secondaryLight dark:text-secondaryDark truncate">
            {releaseData?.source}
          </Typography>
        </Stack>

        <Separator />

        <Stack direction="row" justifyContent="between">
          <Typography variant="h6" className="font-semibold">
            {t('Published on')}
          </Typography>
          <Typography variant="sm">{createdAt}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
};
