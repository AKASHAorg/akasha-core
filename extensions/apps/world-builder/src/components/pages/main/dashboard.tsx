import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@akashaorg/ui/lib/akasha-components/card';
import {
  ErrorLoader,
  ErrorLoaderTitle,
  ErrorLoaderDescription,
  ErrorLoaderFooter,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { transformSource, useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { HOME } from '../../../routes';
import { LandingPageComponent } from './landing-page-component';
import {
  useGetWorldConfigExtensionsQuery,
  useGetWorldConfigQuery,
  useGetWorldFullInfoQuery,
  useGetWorldsByCreatorDidQuery,
} from '@akashaorg/ui-core-hooks/lib/generated';
import { Eye, Loader2, Pencil } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { selectWorldData } from '@akashaorg/ui-core-hooks/lib/selectors/get-worlds-by-creator-did-query';
import {
  selectWorldConfigData,
  selectWorldMetaInfoData,
} from '@akashaorg/ui-core-hooks/lib/selectors/get-world-full-info-query';
import { selectWorldConfigData as selectWorldConfigInfo } from '@akashaorg/ui-core-hooks/lib/selectors/get-world-config-query';
import { selectWorldConfigExtensions } from '@akashaorg/ui-core-hooks/lib/selectors/get-world-config-extensions-query';
import {
  ExtensionAvatar,
  ExtensionAvatarFallback,
  ExtensionAvatarImage,
} from '@/ui/extension-avatar';
import { Image } from '@akashaorg/ui/lib/akasha-components/image';
import { IconContainer } from '@akashaorg/ui/lib/akasha-components/icon-container';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-world-builder');

  const { baseRouteName, getCorePlugins } = useRootComponentProps();
  const navigateTo = getCorePlugins().routing.navigateTo;

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/${routes[HOME]}`,
        }).toString()}`;
      },
    });
  };

  const {
    data: worldsByCreatorDidReq,
    loading: loadingWorldsByCreatorDidQuery,
    error: worldsByCreatorDidError,
  } = useGetWorldsByCreatorDidQuery({
    variables: { id: authenticatedDID, first: 10 },
  });

  const worldData = selectWorldData(worldsByCreatorDidReq);

  const {
    data: worldFullInfoReq,
    loading: loadingWorldFullInfoQuery,
    error: worldFullInfoError,
  } = useGetWorldFullInfoQuery({
    variables: { id: worldData?.id, creator: worldData?.creator?.id },
    skip: !worldData?.id,
  });

  const {
    data: worldConfigReq,
    loading: loadingWorldConfigQuery,
    error: worldConfigError,
  } = useGetWorldConfigQuery({
    variables: { worldID: worldData?.id },
    skip: !worldData?.id,
  });

  const worldConfig = selectWorldConfigInfo(worldConfigReq);
  const worldMetaInfo = selectWorldMetaInfoData(worldFullInfoReq);

  const {
    data: worldConfigExtensionsReq,
    loading: loadingWorldConfigExtensionsQuery,
    error: worldConfigExtensionsError,
  } = useGetWorldConfigExtensionsQuery({
    variables: { configID: worldConfig?.id },
    skip: !worldConfig?.id,
  });

  const worldConfigExtensions = selectWorldConfigExtensions(worldConfigExtensionsReq);

  const handleNavToConfigForm = () => {
    navigate({ to: '/world-config-form/$worldId/step1', params: { worldId: worldData?.id } });
  };

  const handleNavToCustomiseForm = () => {
    navigate({ to: '/world-customize-form', params: { worldId: worldData?.id } });
  };

  const handleNavToWorldCreate = () => {
    navigate({ to: '/world-create-form' });
  };

  const getExtensionDataById = (extId: string) => {
    const extension = worldConfigExtensions?.find(ext => ext.extensionID === extId);
    return extension?.extension;
  };

  if (!authenticatedDID) {
    return (
      <ErrorLoader type="not-authenticated">
        <ErrorLoaderTitle>{`${t('Uh-oh')}! ${t('You are not connected')}!`}</ErrorLoaderTitle>
        <ErrorLoaderDescription>
          {`${t('To create a world configuration you must be connected')} ⚡️`}
        </ErrorLoaderDescription>
        <ErrorLoaderFooter>
          <Button variant="default" size="default" onClick={handleConnectButtonClick}>
            {t('Connect')}
          </Button>
        </ErrorLoaderFooter>
      </ErrorLoader>
    );
  }
  if (loadingWorldsByCreatorDidQuery) {
    return (
      <Card>
        <Loader2 className="animate-spin" />
      </Card>
    );
  }
  if (!loadingWorldsByCreatorDidQuery && !worldData) {
    return <LandingPageComponent />;
  }
  if (!loadingWorldsByCreatorDidQuery && worldData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-start">
            <Typography variant="h5" className="text-left">
              {t('World Builder Dashboard')}
            </Typography>
          </CardTitle>
          <CardDescription className="flex justify-start">
            <Typography variant="sm" className="text-left">
              {t(
                'Right now, you can create only one world at a time 🌍✨ But don’t worry! More possibilities are coming soon! 🚀',
              )}
            </Typography>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-col gap-4">
          <Stack direction="row" spacing={4}>
            <ExtensionAvatar size="xl" extensionId={worldData?.id}>
              <ExtensionAvatarImage src={transformSource(worldData?.icon?.default)?.src} />
              <ExtensionAvatarFallback />
            </ExtensionAvatar>
            <Stack direction="column" spacing={4}>
              <Stack direction="row" justifyContent="between">
                <Typography variant="h6">{worldData?.name}</Typography>
                <Button variant="outline" size="sm">
                  <Eye />
                  {t('Preview')}
                </Button>
              </Stack>
              <Typography variant="sm">
                {t(
                  'Your world doesn’t have a description yet! Let’s bring it to life by adding one in the World Customizer section.',
                )}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="column" spacing={4}>
            <Stack direction="row" justifyContent="between" alignItems="center">
              <Typography variant="h6">{t('World Creation')}</Typography>
              <button onClick={handleNavToWorldCreate}>
                <IconContainer className="bg-secondary">
                  <Pencil />
                </IconContainer>
              </button>
            </Stack>
            {worldData?.extensionPublishers?.length > 0 && (
              <Stack direction="column" spacing={2}>
                <Typography variant="sm" bold>
                  {t('Extension Publishers')}
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {worldData?.extensionPublishers?.map((extPublisher, idx) => (
                    <Typography key={idx} variant="sm">
                      {extPublisher?.id}
                    </Typography>
                  ))}
                </div>
              </Stack>
            )}
            {worldData?.icon && (
              <Stack direction="column" spacing={2}>
                <Typography variant="sm" bold>
                  {t('Icon')}
                </Typography>
                <Image
                  width={24}
                  height={24}
                  src={transformSource(worldData?.icon?.default)?.src}
                />
              </Stack>
            )}
            {worldData?.instanceURL && (
              <Stack direction="column" spacing={2}>
                <Typography variant="sm" bold>
                  {t('Instance URL')}
                </Typography>
                <Typography variant="sm">{worldData?.instanceURL}</Typography>
              </Stack>
            )}
          </Stack>
          <Separator />
          <Stack direction="column" spacing={4}>
            <Stack direction="row" justifyContent="between" alignItems="center">
              <Typography variant="h6">{t('World Config')}</Typography>

              {worldConfig?.id ? (
                <button onClick={handleNavToConfigForm}>
                  <IconContainer className="bg-secondary">
                    <Pencil />
                  </IconContainer>
                </button>
              ) : (
                <Button onClick={handleNavToConfigForm}>{t('Configure World')}</Button>
              )}
            </Stack>
            <Stack direction="column" spacing={2}>
              <Typography variant="sm" bold>
                {t('Layout')}
              </Typography>
              <Typography variant="sm">
                {getExtensionDataById(worldConfig?.layoutExtension)?.displayName}
              </Typography>
            </Stack>
            <Stack direction="column" spacing={2}>
              <Typography variant="sm" bold>
                {t('Extension App')}
              </Typography>
              <Typography variant="sm">
                {getExtensionDataById(worldConfig?.registryExtension)?.displayName}
              </Typography>
            </Stack>
            <Stack direction="column" spacing={2}>
              <Typography variant="sm" bold>
                {t('World Extensions')}
              </Typography>
              <div className="flex flex-wrap gap-2">
                {worldConfigExtensions?.map((extension, idx) => (
                  <Typography key={idx} variant="sm">
                    {extension?.extension?.displayName}
                  </Typography>
                ))}
              </div>
            </Stack>
            <Stack direction="column" spacing={2}>
              <Typography variant="sm" bold>
                {t('Homepage')}
              </Typography>
              <Typography variant="sm">
                {getExtensionDataById(worldConfig?.homepageExtension)?.displayName}
              </Typography>
            </Stack>
          </Stack>
          <Separator />
          <Stack direction="column" spacing={4}>
            <Stack direction="row" justifyContent="between" alignItems="center">
              <Typography variant="h6">{t('World Customisation')}</Typography>
              {worldMetaInfo?.id ? (
                <button onClick={handleNavToCustomiseForm}>
                  <IconContainer className="bg-secondary">
                    <Pencil />
                  </IconContainer>
                </button>
              ) : (
                <Button onClick={handleNavToCustomiseForm}>{t('Customise World')}</Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }
};
