import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import {
  ErrorLoader,
  ErrorLoaderTitle,
  ErrorLoaderDescription,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { useGetWorldConfigQuery } from '@akashaorg/ui-core-hooks/lib/generated';
import {
  selectWorldConfigData,
  selectWorldConfigExtensions,
} from '@akashaorg/ui-core-hooks/lib/selectors/get-world-config-query';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Loader2, Pencil } from 'lucide-react';
import { ExtensionElement } from './extension-element';

type WorldConfigurationSectionProps = {
  worldId: string;
};

export const WorldConfigurationSection: React.FC<WorldConfigurationSectionProps> = ({
  worldId,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-world-builder');

  const {
    data: worldConfigReq,
    loading: loadingWorldConfigQuery,
    error: worldConfigError,
  } = useGetWorldConfigQuery({
    variables: { worldID: worldId },
    skip: !worldId,
  });

  const worldConfig = selectWorldConfigData(worldConfigReq);

  const worldConfigExtensions = selectWorldConfigExtensions(worldConfigReq);

  const handleNavToConfigForm = () => {
    navigate({ to: '/world-config-form/$worldId/step1', params: { worldId: worldId } });
  };

  const getExtensionDataById = (extId: string) => {
    const extension = worldConfigExtensions?.find(ext => ext.extensionID === extId);
    return { id: extId, ...extension?.extension };
  };

  if (worldConfigError) {
    return (
      <ErrorLoader type="script-error">
        <ErrorLoaderTitle>
          {t('Sorry, there was an error when fetching the world config data')}
        </ErrorLoaderTitle>
        <ErrorLoaderDescription>{worldConfigError?.message}</ErrorLoaderDescription>
      </ErrorLoader>
    );
  }

  return (
    <Stack direction="column" spacing={4}>
      {loadingWorldConfigQuery && <Loader2 className="animate-spin" />}
      {!loadingWorldConfigQuery && (
        <Stack direction="row" justifyContent="between" alignItems="center">
          <Typography variant="h6">{t('World Config')}</Typography>
          {worldConfig?.id ? (
            <Button variant="secondary" size="icon" onClick={handleNavToConfigForm}>
              <Pencil />
            </Button>
          ) : (
            <Button onClick={handleNavToConfigForm}>{t('Configure World')}</Button>
          )}
        </Stack>
      )}
      {!worldConfig?.id && (
        <Typography variant="sm" bold>
          {t('You haven’t configured your world yet!')}
        </Typography>
      )}
      {worldConfig?.id && (
        <>
          <Stack direction="column" alignItems="start" spacing={2}>
            <Typography variant="sm" bold>
              {t('Layout')}
            </Typography>
            <ExtensionElement extensionData={getExtensionDataById(worldConfig?.layoutExtension)} />
          </Stack>
          <Stack direction="column" alignItems="start" spacing={2}>
            <Typography variant="sm" bold>
              {t('Extension App')}
            </Typography>
            <ExtensionElement
              extensionData={getExtensionDataById(worldConfig?.registryExtension)}
            />
          </Stack>
          <Stack direction="column" alignItems="start" spacing={2}>
            <Typography variant="sm" bold>
              {t('World Extensions')}
            </Typography>
            <div className="flex flex-wrap gap-2">
              {worldConfigExtensions?.map((extension, idx) => (
                <ExtensionElement key={idx} extensionData={extension.extension} />
              ))}
            </div>
          </Stack>
          <Stack direction="column" alignItems="start" spacing={2}>
            <Typography variant="sm" bold>
              {t('Homepage')}
            </Typography>
            <ExtensionElement
              extensionData={getExtensionDataById(worldConfig?.homepageExtension)}
            />
          </Stack>
        </>
      )}
    </Stack>
  );
};
