import getSDK from '@akashaorg/core-sdk';
import { useEffect, useState } from 'react';
import {
  selectAppName,
  selectAppDisplayName,
  selectAppLogoImage,
  selectAppDescription,
  selectAppType,
} from '@akashaorg/ui-awf-hooks/lib/selectors/get-app-release-by-id-query';
import { useGetAppReleaseByIdLazyQuery } from '@akashaorg/ui-awf-hooks/lib/generated';
import { AkashaApp } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { InstalledExtensionSchema } from '@akashaorg/core-sdk/lib/db/installed-extensions.schema';

export type InstalledExtension = Pick<
  AkashaApp,
  'name' | 'displayName' | 'logoImage' | 'description' | 'applicationType'
>;

export const useInstalledExtensions = () => {
  const [appReleaseLazyQuery] = useGetAppReleaseByIdLazyQuery();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);
  const [apps, setApps] = useState<InstalledExtension[]>(null);
  useEffect(() => {
    const getInstalledExtensions = async () => {
      setLoading(true);
      try {
        const sdk = getSDK();
        const installedExtensions =
          (await sdk.services.db.getCollections().installedExtensions?.toArray()) || [];

        const fetchAppData = async (installedExtension: InstalledExtensionSchema) => {
          const { data } = await appReleaseLazyQuery({
            variables: { id: installedExtension.releaseId },
          });

          return data
            ? {
                name: selectAppName(data),
                displayName: selectAppDisplayName(data),
                logoImage: selectAppLogoImage(data),
                description: selectAppDescription(data),
                applicationType: selectAppType(data),
              }
            : null;
        };

        setApps(await Promise.all(installedExtensions.map(fetchAppData)));
      } catch (ex) {
        setError(ex);
      } finally {
        setLoading(false);
      }
    };
    getInstalledExtensions();
  }, [appReleaseLazyQuery]);

  return { error, loading, data: apps };
};
