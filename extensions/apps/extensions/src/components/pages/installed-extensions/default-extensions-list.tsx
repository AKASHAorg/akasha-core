import React from 'react';
import getSDK from '@akashaorg/core-sdk';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { transformSource, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { useGetAppsByPublisherDidQuery } from '@akashaorg/ui-core-hooks/lib/generated';
import { selectApps } from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-by-publisher-did-query';
import { useTranslation } from 'react-i18next';
import { SortOrder } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useNavigate } from '@tanstack/react-router';
import { getExtensionTypeLabel } from '../../../utils/extension-utils';

export const DefaultExtensionsList = () => {
  const { t } = useTranslation('app-extensions');
  const navigate = useNavigate();
  const { encodeAppName, getDefaultExtensionNames } = useRootComponentProps();
  const sdk = getSDK();
  const defaultApps = getDefaultExtensionNames();

  const { data, error, loading } = useGetAppsByPublisherDidQuery({
    variables: {
      id: sdk.services.gql.indexingDID,
      filters: {
        or: defaultApps.map(app => ({ where: { name: { equalTo: app } } })),
      },
      first: defaultApps.length,
      sorting: { createdAt: SortOrder.Asc },
    },
  });

  const handleAppClick = (appName: string) => {
    navigate({
      to: '/info/$appId',
      params: { appId: encodeAppName(appName) },
    });
  };

  const apps = selectApps(data);

  const defaultExtensions = apps?.map(app => ({
    coverImageSrc: app?.coverImage?.src,
    displayName: app?.displayName,
    applicationType: app?.applicationType,
    extensionTypeLabel: t('{{extensionTypeLabel}}', {
      extensionTypeLabel: getExtensionTypeLabel(app?.applicationType),
    }),
    author: app.author
      ? {
          profileDID: app.author?.akashaProfile?.did?.id,
          name: app.author?.akashaProfile?.name,
          avatar: transformSource(app.author?.akashaProfile?.avatar?.default),
          alternativeAvatars: app.author?.akashaProfile?.avatar.alternatives?.map(alt =>
            transformSource(alt),
          ),
          nsfw: app.author?.akashaProfile?.nsfw,
        }
      : null,
    description: app?.description,
    nsfw: app?.nsfw,
    defaultLabel: t('Default'),
    nsfwLabel: t('NSFW'),
    isDefaultWorldExtension: true,
    action: (
      <Button variant="secondary" label={t('Open')} onClick={() => handleAppClick(app.name)} />
    ),
  }));

  return (
    <Stack spacing="gap-y-4">
      <Stack spacing="gap-y-2">
        <Text variant="h6">{t('Default Extensions')}</Text>
        <Text variant="body2" color={{ light: 'grey5', dark: 'grey6' }}>
          {t(
            'The default extensions are the ones that come preinstalled with AKASHA World. You cannot uninstall them.',
          )}
        </Text>
      </Stack>
      {
        //@TODO replace with Loader component once its created
      }
      {loading && (
        <Stack spacing="gap-y-5" align="center">
          <Spinner />
          <Text variant="button-md">{t('Loading default extensions')}</Text>
        </Stack>
      )}
      {error && (
        <ErrorLoader
          title={t(`Uh-oh! We couldn't load the extensions list!`)}
          details={t(`It seems there's a problem with the server. Please try again later!`)}
          type="list-not-available"
          className="border-none bg-transparent"
        />
      )}
      {defaultExtensions?.length > 0 && (
        <AppList
          apps={defaultExtensions}
          //@TODO implement pagination as the list can grow
          onLoadMore={() => null}
          loadErrorMessage={{
            title: t("Couldn't Load Extension"),
            message: t('Please try again later'),
          }}
        />
      )}
    </Stack>
  );
};
