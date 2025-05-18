import * as React from 'react';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { ChevronRightIcon, FlagIcon, Share2Icon } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { useTranslation } from 'react-i18next';
import { transformSource, useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { formatDate, truncateDid } from '@akashaorg/design-system-core/lib/utils';
import {
  useGetAppsQuery,
  useGetAppsStreamQuery,
} from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Badge } from '@akashaorg/ui/lib/akasha-components/badge';
import {
  selectAkashaApp,
  selectLatestRelease,
} from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-query';
import { selectAkashaAppStreamStatus } from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-stream-query';
import { NetworkStatus } from '@apollo/client';
import { AppInfoHeader } from '../../app-info/header';
import Section, {
  DividerPosition,
} from '@akashaorg/design-system-components/lib/components/Section';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import ExtensionImageGallery from '../../extension-image-gallery';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { CopyToClipboard } from '@akashaorg/ui/lib/akasha-components/copy-to-clipboard';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import { useInstalledExtensions } from '@akashaorg/ui-core-hooks/lib/use-installed-extensions';
import { UninstallModal } from './uninstall-modal';
import AppCoverImage from './AppCoverImage';
import { AppInfoNotificationCards } from '../../app-info/notification-cards';
import { getExtensionStatus, getExtensionTypeLabel } from '../../../utils/extension-utils';
import getSDK from '@akashaorg/core-sdk';
import { ExtensionStatus } from '@akashaorg/typings/lib/ui';
import { StackedAvatar } from '@akashaorg/ui/lib/akasha-components/stacked-avatar';
import {
  ProfileAvatar,
  ProfileAvatarFallback,
  ProfileAvatarImage,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar';

type InfoPageProps = {
  appId: string;
};
export const InfoPage: React.FC<InfoPageProps> = ({ appId }) => {
  const navigate = useNavigate();
  const sdk = useRef(getSDK());
  const { t } = useTranslation('app-extensions');
  const { navigateToModal, decodeAppName, getDefaultExtensionNames, getCorePlugins, logger } =
    useRootComponentProps();
  const [showUninstallModal, setShowUninstallModal] = useState(false);
  const [showImageGalleryOverlay, setShowImageGalleryOverlay] = useState(false);
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const navigateTo = useRef(getCorePlugins().routing.navigateTo);
  const appReq = useGetAppsQuery({
    variables: {
      first: 1,
      filters: {
        where: {
          name: {
            equalTo: decodeAppName(appId),
          },
        },
      },
    },
  });
  const installedExtensionsReq = useInstalledExtensions();
  const isInstalled = useMemo(() => {
    if (installedExtensionsReq.data) {
      return installedExtensionsReq.data.some(ext => ext.name === decodeAppName(appId));
    }
  }, [appId, decodeAppName, installedExtensionsReq.data]);
  const handleInstallClick = () => {
    if (!authenticatedDID) {
      return navigateToModal({
        name: 'login',
        redirectTo: location.pathname,
      });
    }
    navigate({
      to: '/install/$appId',
      params: {
        appId,
      },
    }).catch(err => logger.error('cannot navigate to /install/$appId : %o', err));
  };
  const handleUninstallClick = () => {
    setShowUninstallModal(true);
  };
  const handleOpenClick = () => {
    navigateTo.current({
      appName: decodeAppName(appId),
      getNavigationUrl: () => '/',
    });
  };
  const handleExtensionReportClick = () => {
    navigateTo.current({
      appName: '@akashaorg/app-vibes',
      getNavigationUrl: () => `/report/extension/${appData.id}`,
    });
  };
  const handleReleasesClick = () => {
    navigate({
      to: '/info/$appId/releases',
      params: {
        appId,
      },
    }).catch(err => logger.error('cannot navigate to /info/$appId/versions : %o', err));
  };
  const handleDeveloperClick = () => {
    navigate({
      to: '/info/$appId/developer/$devDid',
      params: {
        appId,
        devDid: appData.author.id,
      },
    }).catch(err => logger.error('cannot navigate to /info/$appId/developer/$devDid : %o', err));
  };
  const handleCollaboratorsClick = () => {
    navigate({
      to: '/info/$appId/contributors',
      params: {
        appId,
      },
    }).catch(err => logger.error('cannot navigate to /info/$appId/contributors : %o', err));
  };
  const handleLicenseClick = () => {
    navigate({
      to: '/info/$appId/license',
      params: {
        appId,
      },
    }).catch(err => logger.error('cannot navigate to /info/$appId/license : %o', err));
  };
  const handleDescriptionClick = () => {
    navigate({
      to: '/info/$appId/description',
      params: {
        appId,
      },
    }).catch(err => logger.error('cannot navigate to /info/$appId/license : %o', err));
  };
  const appData = selectAkashaApp(appReq.data);
  const latestRelease = useMemo(() => selectLatestRelease(appReq.data), [appReq.data]);
  const { data: appStreamReq } = useGetAppsStreamQuery({
    variables: {
      indexer: sdk.current.services.gql.indexingDID,
      first: 1,
      filters: {
        where: {
          applicationID: {
            equalTo: appData?.id,
          },
        },
      },
    },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    skip: !appData?.id || !appData?.id?.trim() || appData?.id?.length < 10,
  });
  const appStreamStatus = selectAkashaAppStreamStatus(appStreamReq);
  const extStatus = getExtensionStatus(false, appStreamStatus);
  const coverImageSrc = useMemo(() => {
    if (appData?.coverImage?.src) {
      return transformSource(appData.coverImage)?.src;
    }
    return null;
  }, [appData]);
  const isDefaultWorldExtension = useMemo(() => {
    if (!appId) {
      return false;
    }
    return getDefaultExtensionNames().includes(decodeAppName(appId));
  }, [appId, decodeAppName, getDefaultExtensionNames]);
  const contributorAvatars = useMemo(() => {
    if (appData?.contributors?.length) {
      return appData.contributors
        .filter(contrib => !!contrib?.akashaProfile)
        .map(contrib => {
          return {
            ...contrib.akashaProfile,
            avatar: transformSource(contrib.akashaProfile.avatar?.default),
          };
        });
    }
  }, [appData?.contributors]);
  return (
    <>
      {appReq.error && (
        <Stack>
          <ErrorLoader type="script-error">
            <ErrorLoaderTitle>{t('There was an error loading the app info')}</ErrorLoaderTitle>
            <ErrorLoaderDescription>
              {t('We cannot show this app right now')}
            </ErrorLoaderDescription>
          </ErrorLoader>
        </Stack>
      )}
      {!appReq.error && appReq.networkStatus === NetworkStatus.ready && !appData && (
        <ErrorLoader type="no-apps">
          <ErrorLoaderTitle>{t('Extension not found!')}</ErrorLoaderTitle>
          <ErrorLoaderDescription>
            {t('The extension you are trying to view cannot be found.')}
          </ErrorLoaderDescription>
        </ErrorLoader>
      )}
      {!appReq.error && appReq.networkStatus === NetworkStatus.ready && !!appData && (
        <>
          <AppCoverImage src={coverImageSrc} appType={appData.applicationType} />
          <Stack>
            <Stack spacing={6}>
              <Card className="p-4 mb-2 rounded-t-none">
                <AppInfoHeader
                  displayName={appData.displayName}
                  extensionType={appData.applicationType}
                  extensionAvatar={{
                    width: appData.logoImage?.width,
                    height: appData.logoImage?.height,
                    src: transformSource(appData.logoImage)?.src,
                  }}
                  nsfw={appData.nsfw}
                  nsfwLabel={'NSFW'}
                  extensionTypeLabel={t('{{extensionTypeLabel}}', {
                    extensionTypeLabel: getExtensionTypeLabel(appData?.applicationType),
                  })}
                  share={{ label: t('Share'), icon: <Share2Icon className="h-4 w-4" /> }}
                  report={{
                    label: t('Flag'),
                    icon: (
                      <FlagIcon className="h-4 w-4 [&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark" />
                    ),
                    onClick: handleExtensionReportClick,
                    color: 'text-errorLight dark:text-errorDark',
                  }}
                  onInstallClick={handleInstallClick}
                  onUninstallClick={handleUninstallClick}
                  onOpenClick={handleOpenClick}
                  isDefaultWorldExtension={isDefaultWorldExtension}
                  isInstalled={isInstalled}
                  isInstallable={!!latestRelease}
                  defaultAppPillLabel={t('Default')}
                  isInReview={extStatus === ExtensionStatus.InReview}
                  isInReviewTitleLabel={t('Extension pending review')}
                  isInReviewDescriptionLabel={t(
                    'This extension is pending review and will be available for installation once approved.',
                  )}
                />

                {!latestRelease && (
                  <AppInfoNotificationCards
                    notification={{
                      message: t('This extension has no releases yet, so it cannot be installed.'),
                      title: t('No releases found'),
                    }}
                  />
                )}

                {appData.description && (
                  <Section
                    dividerPosition={DividerPosition.Top}
                    title={t('Description')}
                    viewMoreLabel={t('Read More')}
                    onClickviewMoreLabel={handleDescriptionClick}
                  >
                    <Typography className="line-clamp-2">{appData.description}</Typography>
                  </Section>
                )}
                <Section title={t('Developer')} dividerPosition={DividerPosition.Top}>
                  {appData.author?.akashaProfile && (
                    <Card className="shadow-none p-0 border-none" onClick={handleDeveloperClick}>
                      <Stack direction="row" alignItems="center">
                        <ProfileAvatarButton
                          profileId={appData.author?.id}
                          label={appData.author?.akashaProfile?.name}
                          avatar={transformSource(appData.author?.akashaProfile?.avatar?.default)}
                          alternativeAvatars={appData.author?.akashaProfile?.avatar?.alternatives?.map(
                            alternative => transformSource(alternative),
                          )}
                        />
                        <ChevronRightIcon className="h-4 w-4 ml-auto [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
                      </Stack>
                    </Card>
                  )}
                </Section>
                {appData.gallery?.length && (
                  <Section
                    dividerPosition={DividerPosition.Top}
                    title={t('Gallery')}
                    viewMoreLabel={t('View All')}
                    onClickviewMoreLabel={() => {
                      setShowImageGalleryOverlay(!showImageGalleryOverlay);
                    }}
                  >
                    <ExtensionImageGallery
                      imageNotLoadedLabel={t(`Cannot load image`)}
                      images={appData.gallery?.map(gImage => ({
                        ...gImage,
                        src: transformSource(gImage)?.src,
                      }))}
                      showOverlay={showImageGalleryOverlay}
                      toggleOverlay={() => setShowImageGalleryOverlay(!showImageGalleryOverlay)}
                    />
                  </Section>
                )}

                <Section title={t('General Information')} dividerPosition={DividerPosition.Top}>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="between">
                      <Typography variant="sm" className="text-grey4 dark:text-grey7">
                        {t('Package name')}
                      </Typography>
                      <CopyToClipboard
                        textToCopy={appData.name}
                        ctaText={t('Copy to clipboard')}
                        successText={t('Copied')}
                      >
                        <Typography
                          variant="sm"
                          bold
                          className="text-secondaryLight dark:text-secondaryDark"
                        >
                          {appData.name}
                        </Typography>
                      </CopyToClipboard>
                    </Stack>
                    <Separator />
                    <Stack direction="row" justifyContent="between">
                      <Typography variant="sm" className="text-grey4 dark:text-grey7">
                        {t('Extension ID')}
                      </Typography>
                      <CopyToClipboard
                        textToCopy={appData.id}
                        ctaText={t('Copy to clipboard')}
                        successText={t('Copied')}
                      >
                        <Typography
                          variant="sm"
                          bold
                          className="text-secondaryLight dark:text-secondaryDark"
                        >
                          {truncateDid(appData.id)}
                        </Typography>
                      </CopyToClipboard>
                    </Stack>
                    <Separator />
                    <Stack direction="row" justifyContent="between">
                      <Typography variant="sm" className="text-grey4 dark:text-grey7">
                        {t('Latest update')}
                      </Typography>
                      <Button variant="link" onClick={handleReleasesClick}>
                        {formatDate(latestRelease?.node?.createdAt, 'DD MMM YYYY')}
                      </Button>
                    </Stack>
                    <Separator />
                    <Stack direction="row" justifyContent="between">
                      <Typography variant="sm" className="text-grey4 dark:text-grey7">
                        {t('License')}
                      </Typography>
                      <Button variant="link" onClick={handleLicenseClick}>
                        {appData.license}
                      </Button>
                    </Stack>
                    <Separator />
                    <Stack direction="row" justifyContent="between">
                      <Typography variant="sm" className="text-grey4 dark:text-grey7">
                        {t('Created on')}
                      </Typography>
                      <Typography variant="sm">
                        {formatDate(appData.createdAt, 'DD MMM YYYY')}
                      </Typography>
                    </Stack>
                  </Stack>
                </Section>
                {appData.links?.length > 0 && (
                  <Section title={t('Useful Links')} dividerPosition={DividerPosition.Top}>
                    <Stack className="flex-wrap">
                      {appData.links?.map((link, idx) => (
                        <CopyToClipboard key={`${link.href}_${idx}`} textToCopy={link.href}>
                          <Typography
                            variant="sm"
                            className="font-light text-secondaryLight dark:text-secondaryDark"
                          >
                            {link.label}
                          </Typography>
                        </CopyToClipboard>
                      ))}
                    </Stack>
                  </Section>
                )}
                {contributorAvatars?.length > 0 && (
                  <Section title={t('Collaborators')} dividerPosition={DividerPosition.Top}>
                    <Card
                      className="shadow-none p-0 border-none"
                      onClick={handleCollaboratorsClick}
                    >
                      <Stack direction="row" alignItems="center">
                        <StackedAvatar count={contributorAvatars.length}>
                          {index => (
                            <ProfileAvatar>
                              <ProfileAvatarImage
                                src={contributorAvatars[index].avatar?.src}
                                alt={contributorAvatars[index].name}
                              />
                              <ProfileAvatarFallback />
                            </ProfileAvatar>
                          )}
                        </StackedAvatar>
                        <ChevronRightIcon className="h-4 w-4 ml-auto [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
                      </Stack>
                    </Card>
                  </Section>
                )}
                <Section
                  title={t('Latest Release')}
                  dividerPosition={DividerPosition.Top}
                  viewMoreLabel={latestRelease ? t('View Info') : undefined}
                  onClickviewMoreLabel={handleReleasesClick}
                >
                  {!!latestRelease && (
                    <Stack spacing={4}>
                      <Stack>
                        <Typography className="text-grey4 dark:text-grey7">
                          {t('Version')} {latestRelease?.node?.version}
                        </Typography>
                        <Typography variant="xs" className="font-medium">
                          {formatDate(latestRelease?.node?.createdAt, 'MMM YYYY')}
                        </Typography>
                      </Stack>
                      <Typography variant="sm" className="line-clamp-2 font-light">
                        {latestRelease?.node?.meta?.find(meta => meta.property === 'description')
                          ?.value || t('This release has no description added.')}
                      </Typography>
                    </Stack>
                  )}
                  {!latestRelease && (
                    <Typography>{t('This extension does not have a release yet.')}</Typography>
                  )}
                </Section>

                {appData.keywords?.length > 0 && (
                  <Section title={''} dividerPosition={DividerPosition.Top}>
                    <Stack direction="row" spacing={2}>
                      {appData.keywords?.map((keyword, idx) => (
                        <Badge key={`${keyword}_${idx}`} variant="outline">
                          <Typography variant="xs">{keyword}</Typography>
                        </Badge>
                      ))}
                    </Stack>
                  </Section>
                )}
              </Card>
            </Stack>
          </Stack>
          <UninstallModal
            appName={appData.name}
            appDisplayName={appData.displayName}
            show={showUninstallModal}
            onModalClose={() => {
              setShowUninstallModal(false);
            }}
          />
        </>
      )}
    </>
  );
};
