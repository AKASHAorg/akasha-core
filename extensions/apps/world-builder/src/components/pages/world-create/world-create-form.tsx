import React, { useEffect, useMemo, useRef, useState } from 'react';
import appRoutes, { WORLD_CREATE_FORM } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import {
  transformSource,
  useAkashaStore,
  useRootComponentProps,
  useSaveImage,
} from '@akashaorg/ui-core-hooks';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@akashaorg/ui/lib/akasha-components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@akashaorg/ui/lib/components/select';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import {
  ErrorLoader,
  ErrorLoaderTitle,
  ErrorLoaderDescription,
  ErrorLoaderFooter,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Image as LucideImage } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@akashaorg/ui/lib/akasha-components/form';
import { Input } from '@akashaorg/ui/lib/akasha-components/input';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import getSDK from '@akashaorg/core-sdk';
import { Image } from '@akashaorg/ui/lib/akasha-components/image';
import {
  useCreateWorldMutation,
  useGetWorldsByCreatorDidQuery,
} from '@akashaorg/ui-core-hooks/lib/generated';
import { selectWorldData } from '@akashaorg/ui-core-hooks/lib/selectors/get-worlds-by-creator-did-query';

export const WorldCreateFormPage: React.FC = () => {
  const { t } = useTranslation('app-world-builder');

  const { uiEvents, baseRouteName, getCorePlugins } = useRootComponentProps();

  const uiEventsRef = useRef(uiEvents);

  const navigate = useNavigate();
  const navigateTo = getCorePlugins().routing.navigateTo;

  const sdk = useRef(getSDK());

  const uploadInputRef: React.RefObject<HTMLInputElement> = useRef(null);

  const indexingDID = sdk.current.services.gql.indexingDID;

  // TODO: fetch indexing DIDs of other publishers
  const extensionPublishersOptions = [{ value: indexingDID, label: 'AKASHA Registry Publisher' }];

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/${appRoutes[WORLD_CREATE_FORM]}`,
        }).toString()}`;
      },
    });
  };

  const showNotification = React.useCallback(
    (type: NotificationTypes, title: string, errorMessage?: string) => {
      uiEventsRef.current.next({
        event: NotificationEvents.ShowNotification,
        data: {
          type,
          title,
          description: errorMessage,
        },
      });
    },
    [],
  );

  const {
    data: worldsByCreatorDidReq,
    loading: loadingWorldsByCreatorDidQuery,
    error: worldsByCreatorDidError,
  } = useGetWorldsByCreatorDidQuery({
    variables: { id: authenticatedDID, first: 10 },
  });

  const worldData = selectWorldData(worldsByCreatorDidReq);

  const FormSchema = z.object({
    name: z.string().min(2, {
      message: t('World name must be at least 2 characters.'),
    }),
    icon: z.any().optional(),
    instanceUrl: z.string().url({ message: 'Must be URL' }).optional().or(z.literal('')),
    extensionPublishers: z.string(),
  });

  const defaultValues = useMemo(() => {
    return {
      name: worldData?.name || '',
      instanceUrl: worldData?.instanceURL || '',
      extensionPublishers: worldData?.extensionPublishers[0]?.id || indexingDID,
    };
  }, [worldData, indexingDID]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const { isValid } = form.formState;

  useEffect(() => {
    if (worldData?.id) {
      form.reset(defaultValues);
    }
  }, [worldData, form, defaultValues]);

  const {
    image: worldImage,
    saveImage: saveWorldImage,
    loading: isSavingWorldImage,
  } = useSaveImage();

  const onSaveImageError = () => {
    showNotification(
      NotificationTypes.Error,
      t("The image wasn't uploaded correctly. Please try again!"),
    );
  };

  const handleUploadClick = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click();
    }
  };

  const [imageName, setImageName] = useState('');
  const onUpload = (image: File) => {
    saveWorldImage({ name: 'world-icon', image: image, onError: onSaveImageError });
    setImageName(image?.name);
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const worldDataContent = {
      name: worldData?.name ?? data.name,
      ...((worldData?.icon?.default?.src || worldImage) && {
        icon: { default: worldImage || worldData?.icon?.default },
      }),
      ...(data.instanceUrl && { instanceURL: data.instanceUrl }),
      extensionPublishers: [data.extensionPublishers],
      createdAt: worldData?.createdAt ?? new Date().toISOString(),
      active: true,
    };
    createWorldMutation({
      variables: {
        i: {
          content: worldDataContent,
        },
      },
    });
  };

  const handleNavToDashboard = () => {
    navigate({ to: '/dashboard' });
  };

  const [createWorldMutation, { loading: loadingWorldMutation }] = useCreateWorldMutation({
    context: { source: sdk.current.services.gql.contextSources.composeDB },
    onCompleted: data => {
      if (worldData?.createdAt) {
        showNotification(
          NotificationTypes.Success,
          t(`Success, you have updated the world model!`),
        );
        handleNavToDashboard();
      } else {
        navigate({
          to: '/create-success',
          search: {
            worldId: data?.setAkashaWorld?.document?.id,
            worldName: data?.setAkashaWorld?.document?.name,
          },
        });
      }
    },
    onError: error => {
      showNotification(
        NotificationTypes.Error,
        t(`Something went wrong when creating the world`),
        error.message,
      );
    },
  });

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          <Typography variant="h5">{t('Create Your World')}</Typography>
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <CardContent className="flex flex-col gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('World Name')}</FormLabel>
                  <FormDescription>
                    {t(`Remember, the world's name cannot be changed once it is set.`)}
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="E.g. Nana World"
                      {...field}
                      disabled={!!worldData?.name}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instanceUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Instance URL')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. http://www.myworld.com"
                      {...field}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={() => (
                <FormItem>
                  <FormLabel>
                    <Stack direction="row" justifyContent="between">
                      <Typography>{t('World Icon')}</Typography>
                      <Button variant="link" onClick={handleUploadClick}>
                        <LucideImage />
                        {t('Upload')}
                      </Button>
                      <input
                        ref={uploadInputRef}
                        type="file"
                        onChange={e => onUpload(e.target.files[0])}
                        hidden
                      />
                    </Stack>
                  </FormLabel>
                  <FormDescription>
                    {t(`Upload a transparent image with a minimum size of 96x96 pixels.`)}
                  </FormDescription>

                  {isSavingWorldImage && (
                    <Stack direction="row" spacing={2}>
                      <Loader2 className="animate-spin" />
                      <Typography variant="h6">{t(`Uploading Icon`)}</Typography>
                    </Stack>
                  )}
                  {!isSavingWorldImage && (
                    <Stack direction="row" spacing={2}>
                      <div className="w-4 h-4">
                        <Image src={transformSource(worldImage || worldData?.icon?.default)?.src} />
                      </div>
                      <Typography variant="p">{imageName}</Typography>
                    </Stack>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="extensionPublishers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Extension Publishers')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={defaultValues.extensionPublishers}
                    required
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('Select an extension publisher')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {extensionPublishersOptions?.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button className="px-6" variant="outline" onClick={handleNavToDashboard}>
              {t('Cancel')}
            </Button>
            <Button
              type="submit"
              className="px-6"
              loading={loadingWorldMutation}
              disabled={!isValid || loadingWorldsByCreatorDidQuery || isSavingWorldImage}
            >
              {worldData?.active ? t('Update') : t('Create')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
