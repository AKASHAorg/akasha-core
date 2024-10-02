import React from 'react';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import routes, { EXTENSIONS } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { InstalledExtension, useInstalledExtensions } from './use-installed-extensions';
import { useNavigate } from '@tanstack/react-router';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

const PUBLIC_IMAGE_PATH = '/images';

export const InstalledExtensionsPage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { getCorePlugins } = useRootComponentProps();
  const { t } = useTranslation('app-extensions');

  const handleAppClick = (appName: string) => {
    getCorePlugins().routing.navigateTo({
      appName,
    });
  };

  const handleClickDiscover = () => {
    navigate({
      to: routes[EXTENSIONS],
    });
  };

  const { data, error, loading } = useInstalledExtensions();

  const addAction = (ext: InstalledExtension) => ({
    ...ext,
    action: (
      <Button variant="secondary" label={t('Open')} onClick={() => handleAppClick(ext.name)} />
    ),
  });

  const installedExtensions = data?.map(addAction);
  const defaultExtensions = [];

  return (
    <Stack spacing="gap-y-4">
      <Text variant="h5">{t('Installed Extensions')}</Text>
      {
        //@TODO replace with Loader component once its created
      }
      {loading && (
        <Card padding="p-4">
          <Stack spacing="gap-y-5" align="center">
            <Spinner />
            <Text variant="button-md">{t('Loading installed extensions')}</Text>
          </Stack>
        </Card>
      )}
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
        <Card padding="p-4">
          <Stack spacing="gap-y-3" align="center">
            <>
              {!installedExtensions.length && (
                <>
                  <Stack customStyle="h-52 w-52">
                    <Image
                      customStyle="object-contain"
                      src={`${PUBLIC_IMAGE_PATH}/longbeam-notfound.webp`}
                    />
                  </Stack>
                  <Text variant="h6">{t('No extensions installed yet!')}</Text>
                  <Stack align="center">
                    <Text as="span" color={{ light: 'grey5', dark: 'grey6' }}>
                      <Button
                        variant="text"
                        size="md"
                        label={t('Discover')}
                        onClick={handleClickDiscover}
                      />{' '}
                      {t('cool extensions and install them')}
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
                />
              )}
            </>
          </Stack>
        </Card>
      )}
      <Card padding="p-4" margin="mb-2">
        <Stack spacing="gap-y-3">
          <Text variant="h6">{t('Default Extensions')}</Text>
          <Text variant="body2" color={{ light: 'grey5', dark: 'grey6' }}>
            {t(
              'The default extensions are the ones that come preinstalled with AKASHA World. You cannot uninstall them.',
            )}
          </Text>
          <AppList apps={defaultExtensions} onLoadMore={() => null} />
        </Stack>
      </Card>
    </Stack>
  );
};
