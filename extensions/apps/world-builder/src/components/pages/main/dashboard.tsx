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
  useGetWorldMetaInfoQuery,
  useGetWorldsByCreatorDidQuery,
} from '@akashaorg/ui-core-hooks/lib/generated';
import { Eye, Loader2, Pencil } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { selectWorldData } from '@akashaorg/ui-core-hooks/lib/selectors/get-worlds-by-creator-did-query';
import { selectWorldMetaInfoData } from '@akashaorg/ui-core-hooks/lib/selectors/get-world-meta-info-query';
import { selectWorldConfigData as selectWorldConfigInfo } from '@akashaorg/ui-core-hooks/lib/selectors/get-world-config-query';
import { selectWorldConfigExtensions } from '@akashaorg/ui-core-hooks/lib/selectors/get-world-config-extensions-query';
import {
  ExtensionAvatar,
  ExtensionAvatarFallback,
  ExtensionAvatarImage,
} from '@/ui/extension-avatar';
import {
  ProfileAvatarButton,
  ProfileAvatarButtonAvatar,
  ProfileAvatarButtonAvatarFallback,
  ProfileAvatarButtonAvatarImage,
  ProfileDidField,
  ProfileName,
} from '@/ui/profile-avatar-button';
import { Badge } from '@akashaorg/ui/lib/akasha-components/badge';
import { iconsMap } from '../world-customise/links/link-element';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-world-builder');

  const { baseRouteName, getCorePlugins, encodeAppName } = useRootComponentProps();
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
    data: worldMetaInfoReq,
    loading: loadingWorldMetaInfoQuery,
    error: worldMetaInfoError,
  } = useGetWorldMetaInfoQuery({
    variables: { worldID: worldData?.id, creator: worldData?.creator?.id },
    skip: !worldData?.id,
  });

  const { data: worldConfigReq, error: worldConfigError } = useGetWorldConfigQuery({
    variables: { worldID: worldData?.id },
    skip: !worldData?.id,
  });

  const worldConfig = selectWorldConfigInfo(worldConfigReq);
  const worldMetaInfo = selectWorldMetaInfoData(worldMetaInfoReq);

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
    navigate({ to: '/world-customise-form/$worldId', params: { worldId: worldData?.id } });
  };

  const handleNavToWorldCreate = () => {
    navigate({ to: '/world-create-form' });
  };

  const handleNavToProfile = (profileDID: string) => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileDID}`,
    });
  };

  const handleNavToApp = (extensionID: string) => {
    navigateTo({
      appName: '@akashaorg/app-extensions',
      getNavigationUrl: () => `/info/${extensionID}`,
    });
  };

  const getExtensionDataById = (extId: string) => {
    const extension = worldConfigExtensions?.find(ext => ext.extensionID === extId);
    return extension?.extension;
  };

  const getEncodedAppName = extData => {
    return encodeAppName(getExtensionDataById(extData)?.name);
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

  if (worldMetaInfoError) {
    return (
      <ErrorLoader type="script-error">
        <ErrorLoaderTitle>
          {t('Sorry, there was an error when fetching the world meta info data')}
        </ErrorLoaderTitle>
        <ErrorLoaderDescription>{worldMetaInfoError?.message}</ErrorLoaderDescription>
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

  if (worldConfigExtensionsError) {
    return (
      <ErrorLoader type="script-error">
        <ErrorLoaderTitle>
          {t('Sorry, there was an error when fetching world config extensions data')}
        </ErrorLoaderTitle>
        <ErrorLoaderDescription>{worldConfigExtensionsError?.message}</ErrorLoaderDescription>
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
              <Button variant="secondary" size="icon" onClick={handleNavToWorldCreate}>
                <Pencil />
              </Button>
            </Stack>
            {worldData?.extensionPublishers?.length > 0 && (
              <Stack direction="column" spacing={2}>
                <Typography variant="sm" bold>
                  {t('Extension Publishers')}
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {worldData?.extensionPublishers?.map((extPublisher, idx) => (
                    <ProfileAvatarButton
                      key={idx}
                      size="sm"
                      profileDID={extPublisher?.id}
                      onClick={() => handleNavToProfile(extPublisher?.id)}
                    >
                      <ProfileAvatarButtonAvatar>
                        <ProfileAvatarButtonAvatarImage
                          src={transformSource(extPublisher?.akashaProfile?.avatar?.default)?.src}
                        />
                        <ProfileAvatarButtonAvatarFallback />
                      </ProfileAvatarButtonAvatar>
                      <ProfileName>{extPublisher?.akashaProfile?.name}</ProfileName>
                      <ProfileDidField />
                    </ProfileAvatarButton>
                  ))}
                </div>
              </Stack>
            )}
            {worldData?.instanceURL && (
              <Stack direction="column" alignItems="start" spacing={2}>
                <Typography variant="sm" bold>
                  {t('Instance URL')}
                </Typography>
                <Button variant="link" className="p-0" asChild>
                  <a rel="noreferrer" target="__blank" href={worldData?.instanceURL}>
                    {worldData?.instanceURL}
                  </a>
                </Button>
              </Stack>
            )}
          </Stack>
          <Separator />
          <Stack direction="column" spacing={4}>
            {loadingWorldConfigExtensionsQuery && <Loader2 className="animate-spin" />}
            {!loadingWorldConfigExtensionsQuery && (
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
                  <Button
                    className="p-0"
                    variant="link"
                    onClick={() => handleNavToApp(getEncodedAppName(worldConfig?.layoutExtension))}
                  >
                    {getExtensionDataById(worldConfig?.layoutExtension)?.displayName}
                  </Button>
                </Stack>
                <Stack direction="column" alignItems="start" spacing={2}>
                  <Typography variant="sm" bold>
                    {t('Extension App')}
                  </Typography>
                  <Button
                    className="p-0"
                    variant="link"
                    onClick={() =>
                      handleNavToApp(getEncodedAppName(worldConfig?.registryExtension))
                    }
                  >
                    {getExtensionDataById(worldConfig?.registryExtension)?.displayName}
                  </Button>
                </Stack>
                <Stack direction="column" alignItems="start" spacing={2}>
                  <Typography variant="sm" bold>
                    {t('World Extensions')}
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {worldConfigExtensions?.map((extension, idx) => (
                      <Button
                        key={idx}
                        className="p-0"
                        variant="link"
                        onClick={() => handleNavToApp(getEncodedAppName(extension.extension))}
                      >
                        {extension?.extension?.displayName}
                      </Button>
                    ))}
                  </div>
                </Stack>
                <Stack direction="column" alignItems="start" spacing={2}>
                  <Typography variant="sm" bold>
                    {t('Homepage')}
                  </Typography>
                  <Button
                    className="p-0"
                    variant="link"
                    onClick={() =>
                      handleNavToApp(getEncodedAppName(worldConfig?.homepageExtension))
                    }
                  >
                    {getExtensionDataById(worldConfig?.homepageExtension)?.displayName}
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
          <Separator />
          <Stack direction="column" spacing={4}>
            {loadingWorldMetaInfoQuery && <Loader2 className="animate-spin" />}
            {!loadingWorldMetaInfoQuery && (
              <>
                <Stack direction="row" justifyContent="between" alignItems="center">
                  <Typography variant="h6">{t('World Customisation')}</Typography>
                  {worldMetaInfo?.id ? (
                    <Button variant="secondary" size="icon" onClick={handleNavToCustomiseForm}>
                      <Pencil />
                    </Button>
                  ) : (
                    <Button onClick={handleNavToCustomiseForm}>{t('Customise World')}</Button>
                  )}
                </Stack>
                {!worldMetaInfo?.id && (
                  <Typography variant="sm">
                    {t('You haven’t customized your world configuration yet!')}
                  </Typography>
                )}
                {worldMetaInfo?.id && (
                  <>
                    <Stack direction="column" spacing={2}>
                      <Typography variant="sm" bold>
                        {t('World Description')}
                      </Typography>
                      <Typography variant="sm">
                        {worldMetaInfo?.description ?? t('You haven’t added any description yet.')}
                      </Typography>
                    </Stack>
                    <Stack direction="column" spacing={2}>
                      <Typography variant="sm" bold>
                        {t('Keywords')}
                      </Typography>
                      <div className="flex flex-wrap gap-2">
                        {worldMetaInfo?.keywords?.length > 0 ? (
                          worldMetaInfo?.keywords?.map((keyword, idx) => (
                            <Badge key={idx} variant="secondary">
                              {keyword}
                            </Badge>
                          ))
                        ) : (
                          <Typography variant="sm">
                            {t('You haven’t added any keywords yet.')}
                          </Typography>
                        )}
                      </div>
                    </Stack>
                    <Stack direction="column" alignItems="start" spacing={2}>
                      <Typography variant="sm" bold>
                        {t('Guidelines URL')}
                      </Typography>
                      <Button variant="link" className="p-0" asChild>
                        <a rel="noreferrer" target="__blank" href={worldMetaInfo?.guidelinesUrl}>
                          {worldMetaInfo?.guidelinesUrl}
                        </a>
                      </Button>
                    </Stack>
                    <Stack direction="column" spacing={2}>
                      <Typography variant="sm" bold>
                        {t('Socials')}
                      </Typography>
                      <Stack direction="column" alignItems="start" spacing={2}>
                        {worldMetaInfo?.socialLinks?.length > 0 ? (
                          worldMetaInfo?.socialLinks?.map((link, idx) => (
                            // <Stack key={idx} direction="row" spacing={2}>
                            <Button key={idx} variant="link" className="p-0" asChild>
                              {iconsMap[link?.name]}

                              <a rel="noreferrer" target="__blank" href={link?.href}>
                                {link?.href}
                              </a>
                            </Button>
                            // </Stack>
                          ))
                        ) : (
                          <Typography variant="sm">
                            {t('You haven’t added any social links yet.')}
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </>
                )}
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }
};
