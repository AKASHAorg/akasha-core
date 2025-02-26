import React, { useState } from 'react';
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
import { Badge } from '@akashaorg/ui/lib/components/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import {
  ErrorLoader,
  ErrorLoaderTitle,
  ErrorLoaderDescription,
  ErrorLoaderFooter,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { Autocomplete, Option } from '@akashaorg/ui/lib/akasha-components/autocomplete';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { X, Loader2, Image as LucideImage } from 'lucide-react';
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
import { Image, ImageRoot } from '@akashaorg/ui/lib/akasha-components/image';
import { useCreateWorldMutation } from '@akashaorg/ui-core-hooks/lib/generated';

export const WorldCreateFormPage: React.FC = () => {
  const { t } = useTranslation('app-extensions');

  const { uiEvents, baseRouteName, getCorePlugins } = useRootComponentProps();

  const uiEventsRef = React.useRef(uiEvents);

  const navigate = useNavigate();
  const navigateTo = getCorePlugins().routing.navigateTo;

  const sdk = React.useRef(getSDK());

  const uploadInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);

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

  const showErrorNotification = React.useCallback((title: string, errorMessage?: string) => {
    uiEventsRef.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Error,
        title,
        description: errorMessage,
      },
    });
  }, []);

  const FormSchema = z.object({
    name: z.string().min(2, {
      message: t('World name must be at least 2 characters.'),
    }),
    icon: z.any().optional(),
    instanceUrl: z.string().url({ message: 'Must be URL' }).optional().or(z.literal('')),
    extensionPublishers: z.any(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      icon: null,
      instanceUrl: '',
      extensionPublishers: [],
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
    const worldData = {
      name: data.name,
      icon: { default: worldImage },
      instanceURL: data.instanceUrl,
      extensionPublishers: data.extensionPublishers?.map(option => option.value),
      createdAt: new Date().toISOString(),
      active: true,
    };
    createWorldMutation({
      variables: {
        i: {
          content: worldData,
        },
      },
    });
  };

  const handleCancel = () => {
    navigate({ to: '/dashboard' });
  };

  const [selectedValues, setSelectedValues] = useState<Option[]>([]);

  const handleValueChange = (value: Option[]) => {
    if (!value) return;
    setSelectedValues(value);
    form.setValue('extensionPublishers', value);
  };

  const handleRemove = (valueToRemove: string) => {
    setSelectedValues(prev => prev.filter(item => item.value !== valueToRemove));
  };

  const [createWorldMutation, { loading: loadingWorldMutation }] = useCreateWorldMutation({
    context: { source: sdk.current.services.gql.contextSources.composeDB },
    onCompleted: data => {
      navigate({
        to: '/create-success',
        search: {
          worldId: data?.setAkashaWorld?.document?.id,
          worldName: data?.setAkashaWorld?.document?.name,
        },
      });
    },
    onError: error => {
      showErrorNotification(`${t(`Something went wrong when creating the world`)}.`, error.message);
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
                    <Input placeholder="E.g. Nana World" {...field} />
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
                    <Input placeholder="e.g. http://www.myworld.com" {...field} />
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
                      <ImageRoot className="w-4 h-4">
                        <Image src={transformSource(worldImage)?.src} />
                      </ImageRoot>
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
                  <FormControl>
                    <Autocomplete
                      placeholder={t('Select an extension publisher')}
                      emptyMessage={t('No publishers available')}
                      value={selectedValues}
                      onValueChange={value => handleValueChange(value)}
                      options={extensionPublishersOptions}
                      multiple
                      {...field}
                    />
                  </FormControl>
                  <div className="flex flex-wrap gap-2">
                    {selectedValues.length > 0 &&
                      selectedValues.map(framework => (
                        <Badge key={framework?.value} variant="secondary">
                          {framework?.label}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 ml-2"
                            onClick={() => handleRemove(framework?.value)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button className="px-6" variant="outline" onClick={handleCancel}>
              {t('Cancel')}
            </Button>
            <Button type="submit" className="px-6" loading={loadingWorldMutation}>
              {t('Create')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
