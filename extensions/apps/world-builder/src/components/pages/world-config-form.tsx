import React from 'react';
import appRoutes, { WORLD_DATA_FORM } from '../../routes';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Stepper } from '@akashaorg/ui/lib/akasha-components/stepper';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import {
  ErrorLoader,
  ErrorLoaderTitle,
  ErrorLoaderDescription,
  ErrorLoaderFooter,
} from '@akashaorg/ui/lib/akasha-components/error-loader';

export const WorldConfigFormPage: React.FC = () => {
  const { t } = useTranslation('app-extensions');

  const { baseRouteName, getCorePlugins } = useRootComponentProps();
  const navigate = useNavigate();
  const navigateTo = getCorePlugins().routing.navigateTo;

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/${appRoutes[WORLD_DATA_FORM]}`,
        }).toString()}`;
      },
    });
  };

  const handleSave = () => {
    navigate({ to: '/dashboard' });
  };
  const handleCancel = () => {
    navigate({ to: '/dashboard' });
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

  return (
    <Card>
      <CardHeader>
        <Stack className="items-center">
          <Stepper currentStep={1} numberOfSteps={3} className="max-w-[250px]" />
        </Stack>
        <CardTitle className="text-center">
          <Typography variant="h5">{t('World Config')}</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>
        <Button className="px-6 h-8" variant="outline" onClick={handleCancel}>
          {t('Cancel')}
        </Button>
        <Button className="px-6 h-8" onClick={handleSave}>
          {t('Next')}
        </Button>
      </CardFooter>
    </Card>
  );
};
