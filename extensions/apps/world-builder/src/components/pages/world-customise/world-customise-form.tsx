import React, { useMemo, useState } from 'react';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@akashaorg/ui/lib/akasha-components/form';
import { Autocomplete } from '@akashaorg/ui/lib/akasha-components/autocomplete';
import { Input } from '@akashaorg/ui/lib/akasha-components/input';
import { Textarea } from '@akashaorg/ui/lib/akasha-components/textarea';
import { Badge } from '@akashaorg/ui/lib/akasha-components/badge';
import { X } from 'lucide-react';

const MAX_KEYWORDS = 32;

const MIN_KEYWORD_CHARACTERS = 3;

export enum FieldName {
  description = 'description',
  keywords = 'keywords',
  guidelinesURL = 'guidelinesURL',
  socialLinks = 'socialLinks',
}

export const WorldCustomiseFormPage: React.FC = () => {
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
          redirectTo: `${baseRouteName}/${appRoutes[WORLD_CUSTOMIZE_FORM]}`,
        }).toString()}`;
      },
    });
  };

  const FormSchema = z.object({
    description: z
      .string()
      .min(3, {
        message: t('World description must be at least 3 characters.'),
      })
      .max(420, {
        message: t('World description must be less than 420 characters.'),
      })
      .optional()
      .or(z.literal('')),
    keywords: z
      .array(
        z.string().max(48, {
          message: t('Keywords must be less than 48 characters.'),
        }),
      )
      .max(32, { message: t('Must have maximum of 32 keywords') }),
    guidelinesURL: z.string().url({ message: 'Must be URL' }).optional().or(z.literal('')),
    socialLinks: z.array(
      z.object({
        name: z
          .string()
          .min(2, {
            message: t('Social links name must be at least 2 characters.'),
          })
          .max(48, {
            message: t('Social links name must be less than 48 characters.'),
          }),
        href: z.string().url({ message: 'Must be URL' }),
      }),
    ),
  });

  const formDefaultValues = useMemo(() => {
    return {
      description: '',
      keywords: [],
      guidelinesURL: '',
      socialLinks: [],
    };
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formDefaultValues,
  });

  const { isValid } = form.formState;

  // useEffect(() => {
  //   if (worldMetaInfo?.id) {
  //     form.setValue('description', worldMetaInfo?.description);
  //     form.setValue('guidelinesUrl', worldMetaInfo?.instanceURL);

  //   }
  // }, [worldMetaInfo, form]);

  const handleCancel = () => {
    navigate({ to: '/dashboard' });
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    navigate({ to: '/dashboard' });
  };

  const [keywords, setKeywords] = useState(formDefaultValues?.keywords);

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
                    <Textarea
                      placeholder="E.g. World for people who like number 7 in Japanese."
                      {...field}
                      // value={field.value || worldMetaInfo?.description}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={FieldName.keywords}
              render={({ field: { value, onChange } }) => {
                return (
                  <FormItem>
                    <FormLabel>{t('World keywords')}</FormLabel>

                    <FormControl>
                      <Input onChange={onChange} placeholder={t('Add a keyword')} />
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
                                  setKeywords(prev =>
                                    prev.filter(prevKeyword => prevKeyword !== keyword),
                                  )
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name={FieldName.guidelinesURL}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Guidelines URL')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. ipfs://bafybeibx/guidelines-nanaworld"
                      {...field}
                      // value={field.value || worldmetaInfo?.guidelinesURL}
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
            <Button className="px-6" variant="outline" onClick={handleCancel}>
              {t('Cancel')}
            </Button>
            <Button
              type="submit"
              className="px-6"
              // loading={loadingWorldMetaInfoMutation}
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
