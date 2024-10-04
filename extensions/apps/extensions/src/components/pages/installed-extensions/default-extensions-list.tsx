import React from 'react';
import getSDK from '@akashaorg/core-sdk';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetAppsByPublisherDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated';
import { selectApps } from '@akashaorg/ui-awf-hooks/lib/selectors/get-apps-by-publisher-did-query';
import { useTranslation } from 'react-i18next';
import { InstalledExtension } from './use-installed-extensions';

export const DefaultExtensionsList: React.FC<unknown> = () => {
  const { t } = useTranslation('app-extensions');
  const { getCorePlugins, worldConfig } = useRootComponentProps();
  const sdk = getSDK();
  const defaultApps = worldConfig.defaultApps || [];

  const { data, error, loading } = useGetAppsByPublisherDidQuery({
    variables: {
      id: sdk.services.gql.indexingDID,
      filters: {
        or: defaultApps.map(app => ({ where: { name: { equalTo: app } } })),
      },
      last: defaultApps.length,
    },
  });

  const handleAppClick = (appName: string) => {
    getCorePlugins().routing.navigateTo({
      appName,
    });
  };

  const apps = selectApps(data);

  const defaultExtensions: InstalledExtension[] = apps?.map(app => ({
    name: app.name,
    displayName: app.displayName,
    logoImage: app.logoImage,
    applicationType: app.applicationType,
    description: app.description,
    action: (
      <Button variant="secondary" label={t('Open')} onClick={() => handleAppClick(app.name)} />
    ),
  }));

  return (
    <Card padding="p-4">
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
            title={
              <Text variant="h5" align="center" selectable={false}>
                {t(`Uh-oh! We couldn't load`)} <br />
                {t(`the extensions list!`)}
              </Text>
            }
            details={
              <Text variant="body2" align="center" selectable={false} customStyle="w-60 sm:w-auto">
                {t(`It seems there's a problem with the server. Please try again later!`)}
              </Text>
            }
            type="list-not-available"
            noWrapperCard={true}
          />
        )}
        {defaultExtensions && <AppList apps={defaultExtensions} onLoadMore={() => null} />}
      </Stack>
    </Card>
  );
};
