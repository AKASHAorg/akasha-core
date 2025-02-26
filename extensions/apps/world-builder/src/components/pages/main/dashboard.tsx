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
import { transformSource, useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { HOME } from '../../../routes';
import { LandingPageComponent } from './landing-page-component';
import {
  useGetWorldConfigQuery,
  useGetWorldsByCreatorDidQuery,
} from '@akashaorg/ui-core-hooks/lib/generated';
import { Eye, Loader2, Pencil } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { selectWorldData } from '@akashaorg/ui-core-hooks/lib/selectors/get-worlds-by-creator-did-query';
import { selectWorldConfigData } from '@akashaorg/ui-core-hooks/lib/selectors/get-world-config-query';
import {
  ExtensionAvatar,
  ExtensionAvatarFallback,
  ExtensionAvatarImage,
} from '@/ui/extension-avatar';

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
    data: worldConfigReq,
    loading: loadingWorldConfigQuery,
    error: worldConfigError,
  } = useGetWorldConfigQuery({
    variables: { worldID: worldData?.id },
    skip: !worldData?.id,
  });

  const worldConfig = selectWorldConfigData(worldConfigReq);

  const handleNavToConfigfForm = () => {
    navigate({ to: '/world-config-form/$worldId/step1', params: { worldId: worldData?.id } });
  };

  const handleNavToWorldCreate = () => {
    navigate({ to: '/world-create-form' });
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
            <ExtensionAvatar size="lg" extensionId={worldData?.id}>
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
            <Stack direction="row" justifyContent="between">
              <Typography variant="h6">{t('World Creation')}</Typography>
              <Button onClick={handleNavToWorldCreate}>
                <Pencil />
              </Button>
            </Stack>
          </Stack>
          <Stack direction="column" spacing={4}>
            <Stack direction="row" justifyContent="between">
              <Typography variant="h6">{t('World Config')}</Typography>
              <Button onClick={handleNavToConfigfForm}>
                {worldConfig?.id ? <Pencil /> : t('Configure World')}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }
};
