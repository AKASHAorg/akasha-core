import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Stepper } from '@akashaorg/ui/lib/akasha-components/stepper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@akashaorg/ui/lib/components/select';
import {
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
import { useAtom } from 'jotai';
import { AtomContext, FormData } from './world-config-main-page';

type WorldConfigFormStep1Props = {
  worldId: string;
};

export const WorldConfigFormStep1Page: React.FC<WorldConfigFormStep1Props> = ({ worldId }) => {
  const { t } = useTranslation('app-extensions');

  const navigate = useNavigate();

  // TODO: use hooks to fetch realtime data and provide alternative options
  const registryExtensionOptions = [
    {
      label: 'Akasha Extension App',
      value: 'k2t6wzhkhabz0ur6eqr9trbna7fswc7xm39jtxkqthznvg01dwtx40dmr163b3',
    },
  ];
  const layoutExtensionOptions = [
    {
      label: 'Akasha World Default Layout',
      value: 'k2t6wzhkhabz0ypl6g42iejy2klea2gdilrw23pow1irm0uc8nem5klh66gle7',
    },
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
    mode: 'onChange',
  });

  const { isDirty, isValid } = form.formState;

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
    <>
      <CardHeader>
        <Stack className="items-center">
          <Stepper currentStep={1} numberOfSteps={2} className="max-w-[112px]" />
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Layout')}</FormLabel>
                  <FormDescription>
                    {t(
                      `The world’s layout is how the content is seen in a page. AKASHA World uses the default layout which is divided into 3 columns. `,
                    )}
                  </FormDescription>

                  <Select onValueChange={field.onChange} required>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('Select a layout extension')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {layoutExtensionOptions?.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registryExtension"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Extension App')}</FormLabel>
                  <FormDescription>
                    {t(
                      `Choose the default extension app where you will find installable extensions and publish yours.`,
                    )}
                  </FormDescription>
                  <Select onValueChange={field.onChange} required>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('Select a registry extension')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {registryExtensionOptions?.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button className="px-6" variant="outline" onClick={handleCancel}>
              {t('Cancel')}
            </Button>
            <Button type="submit" className="px-6" disabled={!isDirty || !isValid}>
              {t('Next')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
};
