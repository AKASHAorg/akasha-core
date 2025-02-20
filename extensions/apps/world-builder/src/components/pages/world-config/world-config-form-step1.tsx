import React, { useContext, useState } from 'react';
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
import { Autocomplete, Option } from '@akashaorg/ui/lib/akasha-components/autocomplete';
import { useAtom } from 'jotai';
import { AtomContext, FormData } from './world-config-main-page';

type WorldConfigFormStep1Props = {
  worldId: string;
};

export const WorldConfigFormStep1Page: React.FC<WorldConfigFormStep1Props> = ({ worldId }) => {
  const { t } = useTranslation('app-extensions');

  const navigate = useNavigate();

  const registryExtensionOptions = [
    { label: 'Akasha Extension App', value: '@akashaorg/app-extensions' },
  ];
  const layoutExtensionOptions = [
    { label: 'Akasha World Default Layout', value: '@akashaorg/ui-widget-layout' },
  ];

  const FormSchema = z.object({
    layoutExtension: z.string(),
    registryExtension: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      layoutExtension: '',
      registryExtension: '',
    },
  });

  const [selectedLayoutValue, setSelectedLayoutValue] = useState<Option>(null);

  const handleLayoutValueChange = (value: Option) => {
    if (!value) return;
    setSelectedLayoutValue(value);
    form.setValue('layoutExtension', value.value);
  };

  const [selectedRegistryValue, setSelectedRegistryValue] = useState<Option>(null);

  const handleRegistryValueChange = (value: Option) => {
    if (!value) return;
    setSelectedRegistryValue(value);
    form.setValue('layoutExtension', value.value);
  };

  const handleCancel = () => {
    navigate({ to: '/dashboard' });
  };

  const [, setForm] = useAtom<FormData>(useContext(AtomContext));

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setForm(prev => {
      return {
        ...prev,
        ...data,
      };
    });
    navigate({ to: '/world-config-form/$worldId/step2', params: { worldId } });
  };

  return (
    <Card>
      <CardHeader>
        <Stack className="items-center">
          <Stepper currentStep={1} numberOfSteps={2} className="max-w-[250px]" />
        </Stack>
        <CardTitle className="text-center">
          <Typography variant="h5">{t('World Configurator')}</Typography>
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <CardContent className="flex flex-col gap-8">
            <FormField
              control={form.control}
              name="layoutExtension"
              render={() => (
                <FormItem>
                  <FormLabel>{t('Layout')}</FormLabel>
                  <FormDescription>
                    {t(
                      `The world’s layout is how the content is seen in a page. AKASHA World uses the default layout which is divided into 3 columns. `,
                    )}
                  </FormDescription>
                  <FormControl>
                    <Autocomplete
                      placeholder={t('Select a layout extension')}
                      emptyMessage={t('No layout extensions available')}
                      value={selectedLayoutValue}
                      onValueChange={value => handleLayoutValueChange(value)}
                      options={layoutExtensionOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registryExtension"
              render={() => (
                <FormItem>
                  <FormLabel>{t('Extension App')}</FormLabel>
                  <FormDescription>
                    {t(
                      `Choose the default extension app where you will find installable extensions and publish yours.`,
                    )}
                  </FormDescription>
                  <FormControl>
                    <Autocomplete
                      placeholder={t('Select a registry extension')}
                      emptyMessage={t('No registry extensions available')}
                      value={selectedRegistryValue}
                      onValueChange={value => handleRegistryValueChange(value)}
                      options={registryExtensionOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button className="px-6 h-8" variant="outline" onClick={handleCancel}>
              {t('Cancel')}
            </Button>
            <Button type="submit" className="px-6 h-8">
              {t('Next')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
