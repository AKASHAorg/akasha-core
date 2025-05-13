import React, { SyntheticEvent, useEffect, useState } from 'react';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@akashaorg/ui/lib/akasha-components/form';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Input } from '@akashaorg/ui/lib/akasha-components/input';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Separator } from '@akashaorg/ui/lib/components/separator';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ButtonType } from '@akashaorg/design-system-components/lib/components/types/common.types';
import { Header, HeaderProps } from './Header';
import { Image } from '@akashaorg/typings/lib/ui';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export enum FieldName {
  name = 'name',
  displayName = 'displayName',
  logoImage = 'logoImage',
  coverImage = 'coverImage',
}

export type ExtensionEditStep1FormValues = {
  name?: string;
  displayName?: string;
  logoImage?: Image | File | null;
  coverImage?: Image | File | null;
};

export type ExtensionEditStep1FormProps = {
  header: Omit<HeaderProps, 'onLogoImageChange' | 'onCoverImageChange'>;
  extensionType: AkashaAppApplicationType;
  defaultValues?: ExtensionEditStep1FormValues;
  cancelButton: ButtonType;
  nextButton: {
    label: string;
    handleClick: (data: ExtensionEditStep1FormValues) => void;
  };
  handleCheckExtProp?: (propToValidate: FieldName.name, fieldValue: string) => void;
  isDuplicateExtProp?: boolean;
  loading?: boolean;
  extensionIdLabel?: string;
  extensionDisplayNameLabel?: string;
};

const ExtensionEditStep1Form: React.FC<ExtensionEditStep1FormProps> = props => {
  const {
    header,
    extensionType,
    defaultValues = {
      name: '',
      displayName: '',
      sourceURL: '',
      logoImage: null,
      coverImage: null,
    },
    cancelButton,
    nextButton,
    handleCheckExtProp,
    isDuplicateExtProp,
    loading,
    extensionIdLabel,
    extensionDisplayNameLabel,
  } = props;

  const form = useForm<ExtensionEditStep1FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const {
    control,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  const isValid = !Object.keys(errors).length;

  const onSave = (event: SyntheticEvent) => {
    event.preventDefault();
    const formValues = getValues();
    if (isValid) {
      nextButton.handleClick({
        ...formValues,
      });
    }
  };

  const [validatedField, setValidatedField] = useState<FieldName.name>();
  useEffect(() => {
    if (isDuplicateExtProp) {
      setError(validatedField, { message: `Extension ${validatedField} must be unique!` });
    } else {
      clearErrors(validatedField);
    }
  }, [isDuplicateExtProp, setError, clearErrors, validatedField]);

  return (
    <Form {...form}>
      <form onSubmit={onSave} className={`h-full`}>
        <Stack direction="column" spacing={4}>
          <Stack className="px-4">
            <Header
              {...header}
              extensionType={extensionType}
              onLogoImageChange={logoImage => {
                setValue('logoImage', logoImage, { shouldDirty: true });
              }}
              onCoverImageChange={coverImage => {
                setValue('coverImage', coverImage, { shouldDirty: true });
              }}
            />
          </Stack>
          <Stack spacing={4} className="px-4 pb-16">
            <FormField
              control={control}
              name={FieldName.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{extensionIdLabel}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={'unique extension identifier'}
                      {...field}
                      onChange={field.onChange}
                      onBlur={() => {
                        setValidatedField(FieldName.name);
                        handleCheckExtProp(FieldName.name, field.value);
                      }}
                      required={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue={defaultValues.name}
            />
            <Separator />
            <FormField
              control={control}
              name={FieldName.displayName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{extensionDisplayNameLabel}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={'extension x'}
                      {...field}
                      onChange={field.onChange}
                      required={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue={defaultValues.displayName}
            />
          </Stack>
          <Separator />

          <Stack direction="row" justifyContent="end" spacing={2} className="px-4 pb-4">
            <Button
              variant="link"
              onClick={cancelButton.handleClick}
              disabled={cancelButton.disabled}
            >
              {cancelButton.label}
            </Button>
            <Button disabled={!isValid || loading} onClick={onSave} type="submit">
              {nextButton.label}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Form>
  );
};

export default ExtensionEditStep1Form;

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(6, { message: 'Must be at least 6 characters' })
    .max(48, { message: 'Must be maximum 48 characters' })
    .refine(
      value => /^[a-zA-Z0-9-_.]+$/.test(value),
      'ID should contain only alphabets, numbers or -_.',
    ),
  displayName: z
    .string()
    .trim()
    .min(4, { message: 'Must be at least 4 characters' })
    .max(24, { message: 'Must be maximum 24 characters' }),
  logoImage: z.any().optional(),
  coverImage: z.any().optional(),
});
