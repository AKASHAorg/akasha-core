import React, { useEffect, useMemo, useRef, useState } from 'react';
import appRoutes, { WORLD_CUSTOMIZE_FORM } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@akashaorg/ui/lib/akasha-components/form';
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteTrigger,
} from '@akashaorg/ui/lib/akasha-components/autocomplete';
import {
  TagsInput,
  TagsInputItem,
  TagsInputList,
} from '@akashaorg/ui/lib/akasha-components/tags-input';
import { Input } from '@akashaorg/ui/lib/akasha-components/input';
import { Textarea } from '@akashaorg/ui/lib/akasha-components/textarea';
import { Badge } from '@akashaorg/ui/lib/akasha-components/badge';
import { X } from 'lucide-react';
import { SocialLink } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { SocialLinks } from './links';
import {
  useCreateAkashaWorldMetaInfoMutation,
  useGetWorldMetaInfoQuery,
} from '@akashaorg/ui-core-hooks/lib/generated';
import { selectWorldMetaInfoData } from '@akashaorg/ui-core-hooks/lib/selectors/get-world-meta-info-query';
import getSDK from '@akashaorg/core-sdk';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import { CircularProgress } from '@/ui/circular-progress';

const WORLD_DESCRIPTION_MAX_LENGTH = 420;

export type WorldCustomiseFormValues = {
  description?: string;
  keywords?: string[];
  guidelinesUrl?: string;
  socialLinks?: SocialLink[];
};

export enum FieldName {
  description = 'description',
  keywords = 'keywords',
  guidelinesUrl = 'guidelinesUrl',
  socialLinks = 'socialLinks',
}

export const WorldCustomiseFormPage: React.FC<{ worldId?: string }> = ({ worldId }) => {
  const { t } = useTranslation('app-world-builder');

  const sdk = useRef(getSDK());

  const { uiEvents, baseRouteName, getCorePlugins } = useRootComponentProps();

  const uiEventsRef = useRef(uiEvents);

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
          redirectTo: `${baseRouteName}/${appRoutes[WORLD_CUSTOMIZE_FORM]}`,
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

  const { data: worldMetaInfoReq, error: worldMetaInfoError } = useGetWorldMetaInfoQuery({
    variables: { worldID: worldId, creator: authenticatedDID },
    skip: !worldId,
  });

  const worldMetaInfo = selectWorldMetaInfoData(worldMetaInfoReq);

  const [createWorldMetaInfoMutation, { loading: loadingWorldMetaInfoMutation }] =
    useCreateAkashaWorldMetaInfoMutation({
      context: { source: sdk.current.services.gql.contextSources.composeDB },
      onCompleted: () => {
        showNotification(
          NotificationTypes.Success,
          `${t(`Success, the world meta info has been updated!`)}.`,
        );
        handleNavToDashboard();
      },
      onError: error => {
        showNotification(
          NotificationTypes.Error,
          `${t(`Something went wrong when creating the world meta info`)}.`,
          error.message,
        );
      },
    });

  const FormSchema = z.object({
    description: z
      .string()
      .min(3, {
        message: t('World description must be at least 3 characters.'),
      })
      .max(WORLD_DESCRIPTION_MAX_LENGTH, {
        message: t(`World description must be less than {{maxLength}} characters.`, {
          maxLength: WORLD_DESCRIPTION_MAX_LENGTH,
        }),
      })
      .optional()
      .or(z.literal('')),
    keywords: z
      .array(
        z.string().max(48, {
          message: t('Keywords must be less than 48 characters.'),
        }),
      )
      .max(32, { message: t('Must have maximum of 32 keywords') })
      .optional(),
    guidelinesUrl: z.string().url({ message: 'Must be URL' }).optional().or(z.literal('')),
    socialLinks: z
      .array(
        z.object({
          name: z
            .string()
            .min(2, {
              message: t('Social links name must be at least 1 characters.'),
            })
            .max(48, {
              message: t('Social links name must be less than 48 characters.'),
            }),
          href: z.string().url({ message: 'Must be URL' }),
        }),
      )
      .optional(),
  });

  const formDefaultValues: WorldCustomiseFormValues = useMemo(() => {
    return {
      description: worldMetaInfo?.description || '',
      keywords: worldMetaInfo?.keywords || [],
      guidelinesUrl: worldMetaInfo?.guidelinesUrl || '',
      socialLinks: worldMetaInfo?.socialLinks || [{ name: 'other', href: '' }],
    };
  }, [worldMetaInfo]);

  const form = useForm<WorldCustomiseFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: formDefaultValues,
  });

  const { isValid } = form.formState;

  useEffect(() => {
    if (worldMetaInfo?.id) {
      form.reset(formDefaultValues);
      setSelectedValues(worldMetaInfo?.keywords);
    }
  }, [formDefaultValues, form, worldMetaInfo]);

  const handleNavToDashboard = () => {
    navigate({ to: '/dashboard' });
  };

  const onSubmit = (data: WorldCustomiseFormValues) => {
    const worldMetaInfoContent = {
      ...(data.description && { description: data.description }),
      ...(data.guidelinesUrl && { guidelinesUrl: data.guidelinesUrl }),
      ...(data.keywords?.length > 0 && { keywords: data.keywords }),
      ...(data.socialLinks?.length > 0 && { socialLinks: data.socialLinks }),
      worldID: worldId,
    };
    createWorldMetaInfoMutation({
      variables: {
        i: {
          content: worldMetaInfoContent,
        },
      },
    });
  };

  const [keywords, setKeywords] = useState(formDefaultValues?.keywords);

  const [value, setValue] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>(formDefaultValues?.keywords);

  const handleValueChange = (value: string[]) => {
    setSelectedValues(value);
    form.setValue('keywords', value);
  };

  const existingKeywords = [];

  if (!authenticatedDID) {
    return (
      <ErrorLoader type="not-authenticated">
        <ErrorLoaderTitle>{`${t('Uh-oh')}! ${t('You are not connected')}!`}</ErrorLoaderTitle>
        <ErrorLoaderDescription>
          {`${t('To customise your world you must be connected')} ⚡️`}
        </ErrorLoaderDescription>
        <ErrorLoaderFooter>
          <Button variant="default" size="default" onClick={handleConnectButtonClick}>
            {t('Connect')}
          </Button>
        </ErrorLoaderFooter>
      </ErrorLoader>
    );
  }

  if (worldMetaInfoError) {
    return (
      <ErrorLoader type="script-error">
        <ErrorLoaderTitle>
          {t('Sorry, there was an error when fetching the world meta info')}
        </ErrorLoaderTitle>
        <ErrorLoaderDescription>{worldMetaInfoError?.message}</ErrorLoaderDescription>
      </ErrorLoader>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          <Typography variant="h5">{t('Customise your World')}</Typography>
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <CardContent className="flex flex-col gap-8">
            <FormField
              control={form.control}
              name={FieldName.description}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('World Description')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        className="w-0 min-w-full"
                        placeholder="E.g. World for people who like number 7 in Japanese."
                        {...field}
                        onChange={field.onChange}
                      />
                      <CircularProgress
                        value={Math.min(
                          Math.floor((field?.value?.length / WORLD_DESCRIPTION_MAX_LENGTH) * 100),
                          100,
                        )}
                        className="absolute bottom-1 right-1"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={FieldName.keywords}
              render={() => {
                return (
                  <FormItem>
                    <FormLabel>{t('World keywords')}</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2 items-center w-full">
                        <Autocomplete
                          multiple
                          value={selectedValues}
                          onValueChange={handleValueChange}
                          className="w-full"
                          emptyMessage={t('No keywords found')}
                        >
                          <AutocompleteTrigger asChild>
                            <TagsInput
                              value={value}
                              onChange={event => setValue(event.target.value)}
                              onTagsChange={tags => {
                                handleValueChange([...tags]);
                              }}
                              placeholder={t('Add a keyword')}
                            >
                              <TagsInputList>
                                {selectedValues.map(interest => (
                                  <TagsInputItem key={interest} tag={interest}>
                                    {
                                      existingKeywords.find(
                                        existingKeyword => existingKeyword.value === interest,
                                      )?.label
                                    }
                                  </TagsInputItem>
                                ))}
                              </TagsInputList>
                            </TagsInput>
                          </AutocompleteTrigger>
                          <AutocompleteList>
                            {existingKeywords.map(existingKeyword => (
                              <AutocompleteItem
                                key={existingKeyword.value}
                                value={existingKeyword.value}
                              >
                                {existingKeyword.label}
                              </AutocompleteItem>
                            ))}
                          </AutocompleteList>
                        </Autocomplete>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {keywords?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, idx) => (
                  <Badge key={idx} variant="outline">
                    {keyword}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 ml-2"
                      onClick={() =>
                        setKeywords(prev => prev.filter(prevKeyword => prevKeyword !== keyword))
                      }
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <FormField
              control={form.control}
              name={FieldName.guidelinesUrl}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Guidelines URL')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. ipfs://bafybeibx/guidelines-nanaworld"
                      {...field}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SocialLinks
              control={form.control}
              onDeleteLink={async () => {
                await form.trigger();
              }}
            />
          </CardContent>
          <CardFooter>
            <Button className="px-6" variant="outline" onClick={handleNavToDashboard}>
              {t('Cancel')}
            </Button>
            <Button
              type="submit"
              className="px-6"
              loading={loadingWorldMetaInfoMutation}
              disabled={!isValid}
            >
              {t('Save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
