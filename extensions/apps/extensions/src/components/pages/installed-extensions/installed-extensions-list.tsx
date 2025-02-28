import React from 'react';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import appRoutes, { HOME, INSTALLED } from '../../../routes';
import { useTranslation } from 'react-i18next';
import {
  type InstalledExtension,
  useInstalledExtensions,
} from '@akashaorg/ui-core-hooks/lib/use-installed-extensions';
import { transformSource, useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { useNavigate } from '@tanstack/react-router';
import { getExtensionTypeLabel } from '../../../utils/extension-utils';

const PUBLIC_IMAGE_PATH = '/images';

export const InstalledExtensionsList = () => {
  const navigate = useNavigate();
  const { getCorePlugins, encodeAppName, baseRouteName } = useRootComponentProps();
  const { t } = useTranslation('app-extensions');

  const navigateTo = getCorePlugins().routing.navigateTo;

  const handleAppClick = (appName: string) => {
    navigate({
      to: '/info/$appId',
      params: { appId: encodeAppName(appName) },
    });
  };

  const handleDiscoverClick = () => {
    navigate({
      to: appRoutes[HOME], // @TODO: update this flow
    });
  };

  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/${appRoutes[INSTALLED]}`,
        }).toString()}`;
      },
    });
  };

  const {
    data: { authenticatedDID, isAuthenticating },
  } = useAkashaStore();
  const { data, error, loading } = useInstalledExtensions();

  const addAction = (ext: InstalledExtension) => ({
    coverImageSrc: ext?.coverImage?.src,
    displayName: ext?.displayName,
    applicationType: ext?.applicationType,
    extensionTypeLabel: t('{{extensionTypeLabel}}', {
      extensionTypeLabel: getExtensionTypeLabel(ext?.applicationType),
    }),
    author: ext.author
      ? {
          profileDID: ext.author?.did?.id,
          name: ext.author?.name,
          avatar: transformSource(ext.author?.avatar?.default),
          alternativeAvatars: ext.author?.avatar.alternatives?.map(alt => transformSource(alt)),
          nsfw: ext.author?.nsfw,
        }
      : null,
    description: ext?.description,
    nsfw: ext?.nsfw,
    defaultLabel: t('Default'),
    nsfwLabel: t('NSFW'),
    action: (
      <Button variant="outline" size="sm" onClick={() => handleAppClick(ext.name)}>
        {t('Open')}
      </Button>
    ),
  });

  const installedExtensions = data?.map(addAction);

  if (!authenticatedDID && !isAuthenticating)
    return (
      <ErrorLoader
        type="not-authenticated"
        title={`${t('Uh-oh')}! ${t('You are not connected')}!`}
        details={`${t('To check installed extensions you must be connected')} ⚡️`}
      >
        <Button onClick={handleConnectButtonClick}>{t('Connect')}</Button>
      </ErrorLoader>
    );

  if (loading || isAuthenticating)
    return (
      <Card className="p-4">
        {
          //@TODO replace with Loader component once its created
        }
        <Stack spacing={5} alignItems="center">
          <Spinner />
          <Text variant="button-md">{t('Loading installed extensions')}</Text>
        </Stack>
      </Card>
    );

  return (
    <>
      {error && (
        <ErrorLoader
          title={
            <Text variant="h5" align="center" selectable={false}>
              {t(`Uh-oh! We couldn't load`)} <br />
              {t(`the extensions list!`)}
            </Text>
          }
          details={
            <Text variant="body2" align="center" selectable={false} customStyle="w-60 sm:w-auto">
              {t('There might be an issue with the database. Please try again later!')}
            </Text>
          }
          type="list-not-available"
        />
      )}
      {installedExtensions && (
        <Stack spacing={3} alignItems="center">
          {!installedExtensions.length && (
            <>
              <Stack className="h-52 w-52">
                <Image
                  customStyle="object-contain"
                  src={`${PUBLIC_IMAGE_PATH}/longbeam-notfound.webp`}
                />
              </Stack>
              <Text variant="h6">{t('No extensions installed yet!')}</Text>
              <Stack alignItems="center">
                <Text as="span" variant="body2" color={{ light: 'grey5', dark: 'grey6' }}>
                  <Button variant="link" onClick={handleDiscoverClick} className="inline-block">
                    {t('Discover')}
                  </Button>
                  {t(' cool extensions and install them')}
                </Text>
                <Text variant="body2" color={{ light: 'grey5', dark: 'grey6' }}>
                  {t('to customize your world')}
                </Text>
              </Stack>
            </>
          )}
          {!!installedExtensions.length && (
            <AppList
              apps={installedExtensions}
              //implementation requires pagination support on installed extensions service on sdk
              onLoadMore={() => null}
              loadErrorMessage={{
                title: t("Couldn't Load Extension"),
                message: t('Please try again later'),
              }}
            />
          )}
        </Stack>
      )}
    </>
  );
};
