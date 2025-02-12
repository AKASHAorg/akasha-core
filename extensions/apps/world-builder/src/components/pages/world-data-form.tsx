import React from 'react';
import appRoutes, { WORLD_DATA_FORM } from '../../routes';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { useAkashaStore, useRootComponentProps, useSaveImage } from '@akashaorg/ui-core-hooks';
import {
  ErrorLoader,
  ErrorLoaderTitle,
  ErrorLoaderDescription,
  ErrorLoaderFooter,
} from '@akashaorg/ui/lib/akasha-components/error-loader';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@akashaorg/ui/lib/akasha-components/form';
import { Input } from '@akashaorg/ui/lib/components/input';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import getSDK from '@akashaorg/core-sdk';

export const WorldDataFormPage: React.FC = () => {
  const { t } = useTranslation('app-extensions');

  const { uiEvents, baseRouteName, getCorePlugins } = useRootComponentProps();

  const uiEventsRef = React.useRef(uiEvents);

  const navigate = useNavigate();
  const navigateTo = getCorePlugins().routing.navigateTo;

  const sdk = React.useRef(getSDK());

  const indexingDID = sdk.current.services.gql.indexingDID;

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

  const showErrorNotification = React.useCallback((title: string) => {
    uiEventsRef.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Error,
        title,
      },
    });
  }, []);

  const FormSchema = z.object({
    name: z.string().min(2, {
      message: t('World name must be at least 2 characters.'),
    }),
    instanceUrl: z.string().url({ message: t('Must be URL') }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  });

  const {
    image: worldImage,
    saveImage: saveWorldImage,
    loading: isSavingWorldImage,
  } = useSaveImage();

  const onSaveImageError = () => {
    showErrorNotification(t("The image wasn't uploaded correctly. Please try again!"));
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log('form data: ', data);
    navigate({ to: '/dashboard' });
  };
  const handleCancel = () => {
    navigate({ to: '/home' });
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
        <CardTitle className="text-center">
          <Typography variant="h5">{t('Create Your World')}</Typography>
        </CardTitle>
      </CardHeader>{' '}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('World Name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. Nana World" {...field} />
                  </FormControl>
                  <FormDescription>
                    {t(`Remember, the world's name cannot be changed once it is set.`)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </CardContent>
          <CardFooter>
            <Button className="px-6 h-8" variant="outline" onClick={handleCancel}>
              {t('Cancel')}
            </Button>
            <Button type="submit" className="px-6 h-8">
              {t('Create')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
