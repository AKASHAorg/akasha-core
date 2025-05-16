import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { CREATE_EXTENSION } from '../../routes';
import { useRootComponentProps, useAkashaStore } from '@akashaorg/ui-core-hooks';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderFooter,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import DefaultEmptyCard from '@akashaorg/design-system-components/lib/components/DefaultEmptyCard';
export const PostPublishPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
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
          redirectTo: `${baseRouteName}/${routes[CREATE_EXTENSION]}`,
        }).toString()}`;
      },
    });
  };
  const handleNavigate = () => {
    navigate({
      to: '/my-extensions',
    });
  };
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
    <Card className="py-6 px-4">
      <Stack spacing={8} alignItems="center">
        <Typography variant="h5" className="font-semibold text-center">
          {t('Extension Published')}
        </Typography>
        <DefaultEmptyCard
          className="border-none"
          assetName="under-review"
          infoText={t(
            'Your submission is under review, this process might take sometime to ensure that your extension doesn’t violate our Code of Conduct.',
          )}
        />
        <Button variant="link" onClick={handleNavigate}>
          {t('Go to My Extensions')}
        </Button>
      </Stack>
    </Card>
  );
};
