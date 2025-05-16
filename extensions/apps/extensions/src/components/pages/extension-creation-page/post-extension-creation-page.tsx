import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { CREATE_EXTENSION } from '../../../routes';
import { useRootComponentProps, useAkashaStore } from '@akashaorg/ui-core-hooks';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { DRAFT_EXTENSIONS } from '../../../constants';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderFooter,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import AppAvatar from '@akashaorg/design-system-components/lib/components/AppAvatar';
import { TriangleAlertIcon } from 'lucide-react';
import {
  ProfileAvatarButton,
  ProfileDidField,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
export const PostExtensionCreationPage: React.FC<{
  extensionId: string;
}> = ({ extensionId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const { baseRouteName, getCorePlugins } = useRootComponentProps();
  const navigateTo = getCorePlugins().routing.navigateTo;
  const {
    data: { authenticatedDID, authenticatedProfile },
  } = useAkashaStore();
  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/${routes[CREATE_EXTENSION]}/${extensionId}`,
        }).toString()}`;
      },
    });
  };
  const handleNavigateToEdit = () => {
    navigate({
      to: '/edit-extension/$extensionId/step1',
      params: {
        extensionId,
      },
    });
  };
  const handleNavigateToReleaseManager = () => {
    navigate({
      to: '/release-manager/$extensionId',
      params: {
        extensionId,
      },
    });
  };
  const existingDraftExtensions =
    JSON.parse(localStorage.getItem(`${DRAFT_EXTENSIONS}-${authenticatedDID}`)) || [];
  const extensionData = existingDraftExtensions.find(ext => ext.id === extensionId);
  if (!authenticatedDID) {
    return (
      <ErrorLoader type="not-authenticated">
        <ErrorLoaderTitle>{`${t('Uh-oh')}! ${t('You are not connected')}!`}</ErrorLoaderTitle>
        <ErrorLoaderDescription>{`${t('To view this page you must be connected')} ⚡️`}</ErrorLoaderDescription>
        <ErrorLoaderFooter>
          <Button onClick={handleConnectButtonClick}>{t('Connect')}</Button>
        </ErrorLoaderFooter>
      </ErrorLoader>
    );
  }
  return (
    <Card className="px-4">
      <Stack spacing={8} alignItems="center">
        <Typography variant="h5" className="font-semibold text-center">
          {t('Your extension has been created locally')}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          className="bg-inherit rounded-[0.625rem] p-2 bg-nested-card"
        >
          <AppAvatar avatar={extensionData.avatar} appType={extensionData.applicationType} />
          <Stack direction="column" justifyContent="between">
            <Typography variant="h6" className="truncate">
              {extensionData.displayName || extensionData.name}
            </Typography>
            <Stack direction="column">
              <Typography variant="xs" bold>
                {authenticatedProfile.name}
              </Typography>
              <ProfileAvatarButton profileDID={authenticatedDID}>
                <ProfileDidField />
              </ProfileAvatarButton>
            </Stack>
          </Stack>
        </Stack>

        <Typography variant="sm" className="font-light text-center">
          {t(`You're almost there!
You can add more details to your extension, such as a description, gallery & more! You can also manage releases to set it up locally or submit a release when you're ready.`)}
        </Typography>

        <Stack direction="row" spacing={4}>
          <Button variant="outline" onClick={handleNavigateToEdit}>
            {t('Add Details')}
          </Button>
          <Button onClick={handleNavigateToReleaseManager}>{t('Manage Releases')}</Button>
        </Stack>
        <Card className="shadow-none bg-nested-card">
          <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <TriangleAlertIcon className="h-4 w-4 [&>*]:stroke-warningLight dark:[&>*]:stroke-warningDark" />
              <Typography variant="sm" className="font-light">
                {t('Important Note: ')}
              </Typography>
            </Stack>
            <Typography variant="sm" className="font-light text-center">
              {t(
                'Extensions that are saved locally will be lost if cache is cleared or if accessed from a different device.',
              )}
            </Typography>
          </Stack>
        </Card>
      </Stack>
    </Card>
  );
};
