import * as React from 'react';
import { useTranslation } from 'react-i18next';
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
import { CopyToClipboard } from '@akashaorg/ui/lib/akasha-components/copy-to-clipboard';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { transformSource, useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { HOME } from '../../../routes';
import { LandingPageComponent } from './landing-page-component';
import { useGetWorldsByCreatorDidQuery } from '@akashaorg/ui-core-hooks/lib/generated';
import { ArrowRight, Eye, Loader2 } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { selectWorldData } from '@akashaorg/ui-core-hooks/lib/selectors/get-worlds-by-creator-did-query';
import {
  ExtensionAvatar,
  ExtensionAvatarFallback,
  ExtensionAvatarImage,
} from '@/ui/extension-avatar';
import { WorldCreationSection } from './world-creation-section';
import { WorldConfigurationSection } from './world-configuration-section';
import { WorldCustomisationSection } from './world-customisation-section';

const truncateMiddle = (str: string, startChars = 8, endChars = 8) =>
  str ? `${str.substring(0, startChars)}...${str.substring(str.length - endChars)}` : '';

export const DashboardPage: React.FC = () => {
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

  if (worldsByCreatorDidError) {
    return (
      <ErrorLoader type="script-error">
        <ErrorLoaderTitle>
          {t('Sorry, there was an error when fetching the world data')}
        </ErrorLoaderTitle>
        <ErrorLoaderDescription>{worldsByCreatorDidError?.message}</ErrorLoaderDescription>
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
              <ExtensionAvatarImage src={transformSource(worldData?.icon?.default)?.src}>
                <ExtensionAvatarFallback />
              </ExtensionAvatarImage>
            </ExtensionAvatar>
            <Stack direction="column" alignItems="start" spacing={1}>
              <Typography variant="h6">{worldData?.name}</Typography>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography variant="xs" bold>
                  {'World ID:'}
                </Typography>
                <CopyToClipboard
                  textToCopy={worldData?.id}
                  ctaText={t('Copy to clipboard')}
                  successText={t('Copied ✓')}
                >
                  <Typography variant="xs" className="text-primary">
                    {truncateMiddle(worldData?.id)}
                  </Typography>
                </CopyToClipboard>
              </Stack>
              <Typography variant="xs">
                {t(
                  'You can setup your own world using the configuration saved here! Check the developer documentation to learn how.',
                )}
              </Typography>
              <Button variant="link" asChild className="p-0">
                <a rel="noreferrer" target="__blank" href={'https://docs.akasha.world'}>
                  {t('Learn how to setup your world')} <ArrowRight />
                </a>
              </Button>
            </Stack>
          </Stack>
          <Separator />
          <Stack direction="column" spacing={4}>
            <Stack direction="row" justifyContent="between" alignItems="center">
              <Typography variant="h6">{t('World Preview')}</Typography>
              <Button variant="outline" size="sm">
                <Eye />
                {t('Preview')}
              </Button>
            </Stack>
            <Typography variant="xs">
              {t(
                `A new tab will open, bringing you to a preview environment. You will no longer be in AKASHA World; instead, you'll be previewing the world you've created. `,
              )}
            </Typography>
          </Stack>
          <Separator />
          <WorldCreationSection worldData={worldData} />
          <Separator />
          <WorldConfigurationSection worldId={worldData?.id} />
          <Separator />
          <WorldCustomisationSection
            worldId={worldData?.id}
            worldCreatorId={worldData?.creator?.id}
          />
        </CardContent>
      </Card>
    );
  }
};
