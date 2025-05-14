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
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Input } from '@akashaorg/ui/lib/akasha-components/input';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import DropDown from '@akashaorg/design-system-core/lib/components/Dropdown';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { ButtonType } from '@akashaorg/design-system-components/lib/components/types/common.types';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export enum FieldName {
  applicationType = 'applicationType',
  name = 'name',
  displayName = 'displayName',
  license = 'license',
  licenseOther = 'licenseOther',
}
export enum Licenses {
  MIT = 'MIT',
  GPL = 'GNU General Public License',
  APACHE = 'Apache License 2.0',
  BSD = 'BSD',
  MPL = 'MPL 2.0',
  OTHER = 'Other',
}
type ExtensionCreationFormValues = {
  applicationType: AkashaAppApplicationType;
  name: string;
  displayName: string;
  license: Licenses | string;
  licenseOther: string;
};
export type ExtensionCreationFormProps = {
  extensionNameFieldLabel?: string;
  extensionNamePlaceholderLabel?: string;
  extensionDisplayNameFieldLabel?: string;
  extensionDisplayNamePlaceholderLabel?: string;
  extensionTypeFieldLabel?: string;
  extensionLicenseFieldLabel?: string;
  extensionLicenseOtherPlaceholderLabel?: string;
  disclaimerLabel?: string;
  defaultValues?: ExtensionCreationFormValues;
  handleCheckExtProp?: (propToValidate: 'name' | 'displayName', fieldValue: string) => void;
  isDuplicateExtProp?: boolean;
  loading?: boolean;
  cancelButton: ButtonType;
  createButton: {
    label: string;
    loading?: boolean;
    handleClick: (data: ExtensionCreationFormValues) => void;
  };
};
const ExtensionCreationForm: React.FC<ExtensionCreationFormProps> = ({
  defaultValues = {
    applicationType: AkashaAppApplicationType.App,
    name: '',
    displayName: '',
    license: Licenses.MIT,
    licenseOther: '',
  },
  handleCheckExtProp,
  isDuplicateExtProp,
  loading,
  cancelButton,
  createButton,
  extensionDisplayNameFieldLabel,
  extensionDisplayNamePlaceholderLabel,
  extensionNameFieldLabel,
  extensionNamePlaceholderLabel,
  extensionLicenseFieldLabel,
  extensionLicenseOtherPlaceholderLabel,
  extensionTypeFieldLabel,
  disclaimerLabel,
}) => {
  const form = useForm<ExtensionCreationFormValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  const {
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors, dirtyFields },
  } = form;
  const extensionLicenseValue = useWatch({
    control,
    name: FieldName.license,
  });
  const extensionTypes = [
    AkashaAppApplicationType.App,
    AkashaAppApplicationType.Plugin,
    AkashaAppApplicationType.Widget,
  ];
  const extensionLicenses = [
    Licenses.MIT,
    Licenses.GPL,
    Licenses.APACHE,
    Licenses.BSD,
    Licenses.MPL,
    Licenses.OTHER,
  ];
  const isFormDirty =
    Object.keys(dirtyFields).includes(FieldName.name) &&
    Object.keys(dirtyFields).includes(FieldName.displayName);
  const isValid = !Object.keys(errors).length;
  const onSave = (event: SyntheticEvent) => {
    event.preventDefault();
    const formValues = getValues();
    if (formValues.license === Licenses.OTHER) {
      formValues.license = formValues.licenseOther;
    }
    if (isValid && isFormDirty) {
      createButton.handleClick({
        ...formValues,
      });
    }
  };
  const [validatedField, setValidatedField] = useState<FieldName.name>();
  useEffect(() => {
    if (isDuplicateExtProp) {
      setError(validatedField, {
        message: `Extension ${validatedField} must be unique!`,
      });
    } else {
      clearErrors(validatedField);
    }
  }, [isDuplicateExtProp, setError, clearErrors, validatedField]);
  return (
    <Form {...form}>
      <form onSubmit={onSave} className={`h-full`}>
        <Stack direction="column" spacing={4}>
          <Stack spacing={4} className="px-4 pb-3">
            <FormField
              control={control}
              name={FieldName.applicationType}
              render={({ field: { name, value, onChange } }) => (
                <FormItem>
                  <FormLabel>{extensionTypeFieldLabel}</FormLabel>
                  <FormControl>
                    <DropDown
                      name={name}
                      selected={value}
                      menuItems={extensionTypes}
                      setSelected={onChange}
                      required={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={control}
              name={FieldName.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{extensionNameFieldLabel}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={extensionNamePlaceholderLabel}
                      {...field}
                      onChange={field.onChange}
                      onBlur={() => {
                        setValidatedField(FieldName.name);
                        handleCheckExtProp(FieldName.name, field.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={control}
              name={FieldName.displayName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{extensionDisplayNameFieldLabel}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={extensionDisplayNamePlaceholderLabel}
                      {...field}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={control}
              name={FieldName.license}
              render={({ field: { name, value, onChange } }) => (
                <FormItem>
                  <FormLabel>{extensionLicenseFieldLabel}</FormLabel>
                  <FormControl>
                    <DropDown
                      label={extensionLicenseFieldLabel}
                      name={name}
                      selected={value}
                      menuItems={extensionLicenses}
                      setSelected={onChange}
                      required={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue={extensionLicenses[0]}
            />
            {extensionLicenseValue === Licenses.OTHER && (
              <FormField
                control={control}
                name={FieldName.licenseOther}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={extensionLicenseOtherPlaceholderLabel}
                        {...field}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                defaultValue=""
              />
            )}

            <Typography variant="sm" className="text-grey4 dark:text-grey6 font-light">
              {disclaimerLabel}
            </Typography>
          </Stack>

          <Separator />

          <Stack direction="row" spacing={2} className="ml-auto mt-auto px-4">
            <Button
              variant="link"
              onClick={cancelButton.handleClick}
              disabled={cancelButton.disabled}
            >
              {cancelButton.label}
            </Button>
            <Button
              loading={createButton.loading}
              disabled={!isFormDirty || !isValid || loading}
              onClick={onSave}
              type="submit"
            >
              {createButton.label}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Form>
  );
};
export default ExtensionCreationForm;
const schema = z.object({
  name: z
    .string()
    .trim()
    .min(6, {
      message: 'Must be at least 6 characters',
    })
    .max(48, {
      message: 'Must be maximum 48 characters',
    })
    .refine(
      value => /^[a-zA-Z0-9-_.]+$/.test(value),
      'ID should contain only alphabets, numbers or -_.',
    ),
  applicationType: z.string(),
  displayName: z
    .string()
    .trim()
    .min(4, {
      message: 'Must be at least 4 characters',
    })
    .max(24, {
      message: 'Must be maximum 24 characters',
    }),
  license: z.string(),
  licenseOther: z.string().trim().min(3, {
    message: 'Must be at least 3 characters',
  }),
});
